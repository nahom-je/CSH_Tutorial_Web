// ============================================================
// config.js — CSH Tutorial  (NOT exposed to the frontend)
// Edit these values once; the rest of the code reads from here.
// ============================================================

export const PRICING = {
  sem1: 399,          // ETB — Semester 1 only
  sem2: 399,          // ETB — Semester 2 only
  full: 699,          // ETB — Full Year (both semesters) — Discounted!
};

export const PLAN_LABELS = {
  sem1: "Semester 1",
  sem2: "Semester 2",
  full: "Full Year (Sem 1 + Sem 2)",
};

// ──────────────────────────────────────────────
// Private Telegram channel IDs (negative numbers)
// We use ONE channel for all plans.
// ──────────────────────────────────────────────
const privateChanId = process.env.PRIVATE_CHANNEL_ID || process.env.CHANNEL_SEM1_ID || "-1004330230276";
export const CHANNELS = {
  private: privateChanId,
  sem1:    privateChanId,
  sem2:    privateChanId,
};


// ──────────────────────────────────────────────
// Public announcements channel link
// ──────────────────────────────────────────────
export const ANNOUNCEMENTS_CHANNEL = process.env.ANNOUNCEMENTS_CHANNEL || "https://t.me/campus_study_hub";

// ──────────────────────────────────────────────
// Order code prefix & starting counter
// Orders will look like NT-1001, NT-1002 …
// ──────────────────────────────────────────────
export const ORDER_CODE_PREFIX = "NT";
export const ORDER_CODE_START  = 1001;

// ──────────────────────────────────────────────
// Business rules
// ──────────────────────────────────────────────
export const MAX_OPEN_ORDERS = 3;           // per student
export const INVITE_LINK_EXPIRY_HOURS = 48; // hours before invite link expires
export const QUIZ_PLATFORM_URL = process.env.QUIZ_PLATFORM_URL || "http://localhost:5173/quizzes";

