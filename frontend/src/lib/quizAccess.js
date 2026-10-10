// src/lib/quizAccess.js — Order Code Access & Verification Manager
const ACCESS_STORAGE_KEY = 'csh_quiz_access';
const BOT_API_URL = import.meta.env.VITE_BOT_API_URL || 'http://localhost:3000';

/**
 * Normalizes any variation of an order code to "NT-XXXXXX" or "NT-NNNN"
 * Handles "NT-8K3P9Q", "8K3P9Q", "nt-8k3p9q", "1001", "NT-1001", etc.
 */
export function normalizeOrderCode(input) {
  if (!input) return '';
  const str = String(input).trim().toUpperCase();

  // If already starts with NT (with optional separator like space, dash, underscore)
  if (/^NT/i.test(str)) {
    return str.replace(/^NT[\s\-_]*/i, 'NT-');
  }

  // If user only typed code body without prefix (3 to 8 alphanumeric chars)
  if (/^[A-Z0-9]{3,8}$/.test(str)) {
    return `NT-${str}`;
  }

  return str;
}

/**
 * Validates syntax: NT- followed by 3 to 8 alphanumeric chars.
 * Supports both new random codes (e.g. NT-8K3P9Q) and legacy numeric codes (e.g. NT-1001).
 */
export function isValidOrderCodeFormat(code) {
  const norm = normalizeOrderCode(code);
  return /^NT-[A-Z0-9]{3,8}$/.test(norm);
}


/**
 * Retrieve saved access from localStorage
 */
export function getStoredAccess() {
  try {
    const raw = localStorage.getItem(ACCESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.orderCode && isValidOrderCodeFormat(parsed.orderCode)) {
      return parsed;
    }
  } catch {
    // Ignore corrupt storage
  }
  return null;
}

/**
 * Save verified access to localStorage
 */
export function saveAccess(data) {
  const norm = normalizeOrderCode(data.orderCode);
  const payload = {
    orderCode: norm,
    name: data.name || 'CSH Student',
    plan: data.plan || 'Semester 1',
    unlockedAt: new Date().toISOString(),
    verified: true,
  };
  localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

/**
 * Remove saved access
 */
export function clearAccess() {
  localStorage.removeItem(ACCESS_STORAGE_KEY);
}

import { supabase } from './supabase';

/**
 * Verify order code directly against Supabase database (and fallback to bot API server).
 * Access is ONLY granted when status is explicitly "approved".
 */
export async function verifyOrderAccess(inputCode) {
  const norm = normalizeOrderCode(inputCode);
  if (!isValidOrderCodeFormat(norm)) {
    return {
      success: false,
      message: 'Invalid order code format. Please use format like NT-8K3P9Q (or NT-1001).',
    };
  }

  // 1. Direct Supabase verification (ultra-fast, works on edge without cold starts)
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('order_code, name, plan, status')
      .eq('order_code', norm)
      .maybeSingle();

    if (error) {
      console.warn('Supabase query error:', error.message);
    } else if (!order) {
      return {
        success: false,
        message: `Order code "${norm}" was not found. Please double-check your code.`,
      };
    } else if (order.status !== 'approved') {
      const msg = order.status === 'awaiting_payment'
        ? 'Your order is awaiting payment receipt verification by admin.'
        : 'Your order is pending admin approval. You will receive access once approved.';
      return {
        success: false,
        message: msg,
      };
    } else {
      // Order exists and status is approved!
      const access = saveAccess({
        orderCode: order.order_code,
        name: order.name,
        plan: order.plan,
      });
      return {
        success: true,
        access,
        message: `Welcome back, ${order.name || 'Student'}! Access unlocked.`,
      };
    }
  } catch (dbErr) {
    console.warn('Supabase verification error:', dbErr.message);
  }

  // 2. Secondary fallback: Query bot API server (if configured and not localhost)
  if (BOT_API_URL && !BOT_API_URL.includes('localhost')) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${BOT_API_URL}/api/verify-order?code=${encodeURIComponent(norm)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (res.ok && data.valid) {
        const access = saveAccess({
          orderCode: data.order_code,
          name: data.name,
          plan: data.plan,
        });
        return { success: true, access, message: 'Order verified successfully!' };
      }
    } catch (_) {
      // Ignore
    }
  }

  return {
    success: false,
    message: 'Unable to reach the verification server. Please check your connection and try again.',
  };
}

/**
 * Checks URL search parameters (?order=NT-1001&token=...) on page mount
 * Auto-unlocks and cleans up URL without reloading.
 */
export async function checkAndProcessUrlAccess() {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const orderParam = params.get('order') || params.get('order_code');
  const tokenParam = params.get('token');

  if (orderParam) {
    const res = await verifyOrderAccess(orderParam);
    if (res.success) {
      // Remove sensitive query params from browser URL bar cleanly
      params.delete('order');
      params.delete('order_code');
      params.delete('token');
      const newQuery = params.toString();
      const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '') + window.location.hash;
      window.history.replaceState({}, '', newUrl);
      return res.access;
    }
  }

  return getStoredAccess();
}
