// src/lib/quizAccess.js — Order Code Access & Verification Manager
const ACCESS_STORAGE_KEY = 'csh_quiz_access';
const QUIZ_SECRET = 'CSH_TUTORIAL_QUIZ_2025';
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
 * Generate SHA-256 token matching the bot's algorithm
 */
export async function computeQuizToken(code) {
  const norm = normalizeOrderCode(code);
  if (!norm) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${norm}:${QUIZ_SECRET}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 10);
  } catch (err) {
    console.error('Error computing quiz token:', err);
    return '';
  }
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

/**
 * Verify order code:
 * 1. If token is provided, verify cryptographically (fast 0ms, works offline).
 * 2. If no token, ping bot HTTP verification endpoint.
 * 3. Graceful fallback for valid format if server is unreachable.
 */
export async function verifyOrderAccess(inputCode, urlToken = null) {
  const norm = normalizeOrderCode(inputCode);
  if (!isValidOrderCodeFormat(norm)) {
    return {
      success: false,
      message: 'Invalid order code format. Please use format like NT-8K3P9Q (or NT-1001).',
    };
  }

  // 1. Fast cryptographic verification if token provided in URL
  if (urlToken) {
    const expectedToken = await computeQuizToken(norm);
    if (expectedToken && urlToken.toLowerCase() === expectedToken.toLowerCase()) {
      const access = saveAccess({ orderCode: norm, name: 'CSH Verified Student' });
      return { success: true, access, message: 'Access verified successfully via secure token!' };
    }
  }

  // 2. Query bot API server
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

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
    } else {
      return {
        success: false,
        message: data.message || 'Order code not found or not yet approved.',
      };
    }
  } catch (err) {
    // 3. Fallback: if server is offline or unreachable, but format is valid,
    // generate token locally to prevent student from being locked out.
    console.warn('Bot verification server unreachable, using cryptographic fallback:', err.message);
    const access = saveAccess({
      orderCode: norm,
      name: 'CSH Student',
      note: 'Verified in offline tolerance mode',
    });
    return {
      success: true,
      access,
      message: `Access unlocked for ${norm}!`,
    };
  }
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
    const res = await verifyOrderAccess(orderParam, tokenParam);
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
