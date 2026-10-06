// src/utils/helpers.js — Shared formatting & validation helpers
import { PRICING, PLAN_LABELS } from "../../config.js";

// ── Keyboard builders ─────────────────────────────────────────

export function planKeyboard() {
  return {
    inline_keyboard: [
      [{ text: `📘 Semester 1 — ${PRICING.sem1} ETB`, callback_data: "plan_sem1" }],
    ],
  };
}

export function fieldKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "📚 Social",  callback_data: "field_social"  },
        { text: "🔬 Natural", callback_data: "field_natural" },
      ],
    ],
  };
}

export function usernameConfirmKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "✅ Yes, continue",      callback_data: "username_yes" },
        { text: "✏️ No, enter username", callback_data: "username_no"  },
      ],
    ],
  };
}

export function paymentMethodKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "📱 TeleBirr", callback_data: "pay_telebirr" },
        { text: "🏦 CBE",      callback_data: "pay_cbe"      },
      ],
    ],
  };
}

export function screenshotKeyboard(orderCode) {
  return {
    inline_keyboard: [
      [{ text: "✅ I've sent the screenshot", callback_data: `screenshot_sent_${orderCode}` }],
      [{ text: "💬 Contact @Umeribnukedir",         url: "https://t.me/Umeribnukedir"                  }],
    ],
  };
}

export function adminApproveRejectKeyboard(orderCode) {
  return {
    inline_keyboard: [
      [
        { text: "✅ Approve", callback_data: `admin_approve_${orderCode}` },
        { text: "❌ Reject",  callback_data: `admin_reject_${orderCode}`  },
      ],
    ],
  };
}

// ── Validation ────────────────────────────────────────────────

export function isValidPhone(phone) {
  return /^(09|07)\d{8}$/.test(phone.trim());
}

export function isValidName(name) {
  return name.trim().length >= 3;
}

export function isValidUsername(username) {
  const clean = username.trim().replace(/^@/, "");
  return clean.length >= 3;
}

export function escapeMd(text) {
  if (!text) return "";
  return String(text).replace(/[_*`\[]/g, "\\$&");
}

// Safe for Telegram HTML mode — escapes &, <, >
export function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Formatting ─────────────────────────────────────────────────

export function formatOrderSummary(order) {
  const safeUsername = order.telegram_username
    ? `@${escapeHtml(order.telegram_username.replace(/^@/, ""))}`
    : "N/A";
  return (
    `📋 <b>Order Summary</b>\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `🆔 Order Code: <code>${escapeHtml(order.order_code)}</code>\n` +
    `👤 Name: <b>${escapeHtml(order.name)}</b>\n` +
    `✈️ Telegram Username: ${safeUsername}\n` +
    `🎓 Field: ${escapeHtml(order.department || "N/A")}\n` +
    `📦 Plan: <b>${escapeHtml(PLAN_LABELS[order.plan] || order.plan)}</b>\n` +
    `💰 Price: <b>${order.price} ETB</b>\n` +
    `💳 Method: ${order.method === "telebirr" ? "TeleBirr" : "CBE"}\n` +
    `📅 Created: ${order.created_at}\n` +
    `📊 Status: <b>${escapeHtml(order.status)}</b>`
  );
}

export function formatAdminNotification(order) {
  const safeUsername = order.telegram_username
    ? `@${escapeHtml(order.telegram_username.replace(/^@/, ""))}`
    : "N/A";
  return (
    `🔔 <b>New Payment Screenshot Sent</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 Order: <code>${escapeHtml(order.order_code)}</code>\n` +
    `👤 Name: <b>${escapeHtml(order.name)}</b>\n` +
    `✈️ TG Username: ${safeUsername}\n` +
    `🎓 Field: ${escapeHtml(order.department || "N/A")}\n` +
    `📦 Plan: <b>${escapeHtml(PLAN_LABELS[order.plan] || order.plan)}</b>\n` +
    `💰 Price: <b>${order.price} ETB</b>\n` +
    `💳 Method: ${order.method === "telebirr" ? "TeleBirr" : "CBE"}`
  );
}

export function coursesForPlan(plan, field) {
  const isSocial = String(field).toLowerCase().includes("social");

  const sem1Natural =
    `📘 *Semester 1 (Natural Science) Courses:*\n` +
    `• Mathematics for Natural Sciences\n` +
    `• General Physics\n` +
    `• Communicative English Language Skills I\n` +
    `• General Psychology\n` +
    `• Critical Thinking\n` +
    `• Geography of Ethiopia and the Horn\n` +
    `• Physical Fitness`;

  const sem1Social =
    `📘 *Semester 1 (Social Science) Courses:*\n` +
    `• General Economics\n` +
    `• Mathematics for Social Science\n` +
    `• Communicative English Language 1\n` +
    `• Geography\n` +
    `• Logic and Critical Thinking\n` +
    `• General Psychology\n` +
    `• Physical Fitness`;

  // Social Science stream only has Semester 1 courses
  if (isSocial) {
    return sem1Social;
  }

  const sem1 = sem1Natural;

  const sem2 =
    `📗 *Semester 2 Courses (Natural Science):*\n` +
    `• Communicative English Language Skills II\n` +
    `• Social Anthropology\n` +
    `• Applied Mathematics I\n` +
    `• Entrepreneurship\n` +
    `• Introduction to Emerging Technologies\n` +
    `• Moral and Civic Education\n` +
    `• Computer Programming\n` +
    `• History of Ethiopia and the Horn`;

  if (plan === "sem1") return sem1;
  if (plan === "sem2") return sem2;
  return `${sem1}\n\n${sem2}`;
}

// HTML-safe version of course lists (used with parse_mode: HTML)
export function coursesForPlanHtml(plan, field) {
  const sem1Social =
    "📘 <b>Semester 1 Courses (Social Science):</b>\n" +
    "• General Economics\n" +
    "• Mathematics for Social Science\n" +
    "• Communicative English Language 1\n" +
    "• Geography\n" +
    "• Logic and Critical Thinking\n" +
    "• General Psychology\n" +
    "• Physical Fitness";

  const sem1Natural =
    "📘 <b>Semester 1 Courses (Natural Science):</b>\n" +
    "• Communicative English Language Skills I\n" +
    "• Introduction to Sociology\n" +
    "• Applied Mathematics I\n" +
    "• Moral and Civic Education\n" +
    "• Geography of Ethiopia and the Horn\n" +
    "• Introduction to Emerging Technologies\n" +
    "• Physical Fitness";

  return field === "Natural" ? sem1Natural : sem1Social;
}
