// src/utils/helpers.js — Shared formatting & validation helpers
import { PRICING, PLAN_LABELS } from "../../config.js";

// ── Keyboard builders ─────────────────────────────────────────

export function planKeyboard() {
  return {
    inline_keyboard: [
      [{ text: `📘 Semester 1 — ${PRICING.sem1} ETB`,            callback_data: "plan_sem1" }],
      [{ text: `📗 Semester 2 — ${PRICING.sem2} ETB`,            callback_data: "plan_sem2" }],
      [{ text: `🎓 Full Year (Both) — ${PRICING.full} ETB`,      callback_data: "plan_full" }],
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

// ── Formatting ─────────────────────────────────────────────────

export function formatOrderSummary(order) {
  return (
    `📋 *Order Summary*\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `🆔 Order Code: \`${order.order_code}\`\n` +
    `👤 Name: ${order.name}\n` +
    `✈️ Telegram Username: @${order.telegram_username ? order.telegram_username.replace(/^@/, "") : "N/A"}\n` +
    `🎓 Field: ${order.department || "N/A"}\n` +
    `📦 Plan: ${PLAN_LABELS[order.plan]}\n` +
    `💰 Price: ${order.price} ETB\n` +
    `💳 Method: ${order.method === "telebirr" ? "TeleBirr" : "CBE"}\n` +
    `📅 Created: ${order.created_at}\n` +
    `📊 Status: ${order.status}`
  );
}

export function formatAdminNotification(order) {
  return (
    `🔔 *New Payment Screenshot Sent*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 Order: \`${order.order_code}\`\n` +
    `👤 Name: ${order.name}\n` +
    `✈️ TG Username: @${order.telegram_username ? order.telegram_username.replace(/^@/, "") : "N/A"}\n` +
    `🎓 Field: ${order.department || "N/A"}\n` +
    `📦 Plan: ${PLAN_LABELS[order.plan]}\n` +
    `💰 Price: ${order.price} ETB\n` +
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
