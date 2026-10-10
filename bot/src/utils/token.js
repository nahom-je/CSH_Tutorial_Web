// src/utils/token.js — Generate lightweight secure verification tokens for order quiz access
import crypto from "crypto";

export const QUIZ_ACCESS_SECRET = process.env.QUIZ_ACCESS_SECRET || "CSH_TUTORIAL_QUIZ_2025";

export function normalizeOrderCode(code) {
  if (!code) return "";
  const str = String(code).trim().toUpperCase();
  if (/^NT/i.test(str)) {
    return str.replace(/^NT[\s\-_]*/i, "NT-");
  }
  if (/^[A-Z0-9]{3,8}$/.test(str)) {
    return `NT-${str}`;
  }
  return str;
}

export function isValidOrderCodeFormat(code) {
  const norm = normalizeOrderCode(code);
  return /^NT-[A-Z0-9]{3,8}$/.test(norm);
}

export function generateQuizToken(code) {
  const normalized = normalizeOrderCode(code);
  if (!normalized) return "";
  return crypto
    .createHash("sha256")
    .update(`${normalized}:${QUIZ_ACCESS_SECRET}`)
    .digest("hex")
    .slice(0, 10);
}
