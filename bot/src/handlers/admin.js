// src/handlers/admin.js — All admin-only commands and approve/reject callbacks
import {
  getPendingOrders, getOrderByCode, updateOrderStatus,
  findOrders, getStats, resetOrderDeviceId, resetOrderDeviceIdByTelegramId,
  setChapterLockStatus, getCourseChaptersStatus, setAllChaptersLockStatus,
} from "../db/database.js";
import { formatOrderSummary, escapeMd, escapeHtml } from "../utils/helpers.js";
import { deliverAccess } from "../utils/delivery.js";
import { normalizeOrderCode } from "../utils/token.js";
import { PLAN_LABELS, QUIZ_PLATFORM_URL } from "../../config.js";
import { clearQuizChapterCache } from "../utils/quizApi.js";
import { logger } from "../utils/logger.js";

function isAdmin(ctx) {
  const adminId = process.env.ADMIN_CHAT_ID;
  const fromId  = String(ctx.from?.id ?? "");
  const chatId  = String(ctx.chat?.id ?? "");
  return adminId && (fromId === String(adminId) || chatId === String(adminId));
}

function adminOnly(handler) {
  return async (ctx) => {
    if (!isAdmin(ctx)) {
      await ctx.reply("🚫 You are not authorized to use this command.");
      return;
    }
    return handler(ctx);
  };
}

export function registerAdminHandlers(bot) {

  // ── /pending — list orders awaiting or screenshot_sent
  bot.command("pending", adminOnly(async (ctx) => {
    const orders = await getPendingOrders();
    if (!orders.length) {
      await ctx.reply("✅ No pending orders right now.");
      return;
    }
    const lines = orders.map((o) =>
      `🆔 <code>${escapeHtml(o.order_code)}</code> | ${escapeHtml(o.name)} | ${escapeHtml(PLAN_LABELS[o.plan] || o.plan)} | ${o.price} ETB | Status: ${o.status}`
    );
    await ctx.reply(
      `📋 <b>Pending Orders (${orders.length})</b>\n\n${lines.join("\n")}`,
      { parse_mode: "HTML" }
    );
  }));

  // ── /approve <order_code>
  bot.command("approve", adminOnly(async (ctx) => {
    const raw = ctx.message.text.split(" ")[1];
    const code = normalizeOrderCode(raw);
    if (!code) {
      await ctx.reply("Usage: /approve <order_code> (e.g. /approve NT-8K3P9Q)");
      return;
    }
    await handleApprove(ctx, code);
  }));

  // ── /reject <order_code> <reason>
  bot.command("reject", adminOnly(async (ctx) => {
    const parts = ctx.message.text.split(" ");
    const code   = normalizeOrderCode(parts[1]);
    const reason = parts.slice(2).join(" ") || "No reason provided.";
    if (!code) {
      await ctx.reply("Usage: /reject <order_code> <reason> (e.g. /reject NT-8K3P9Q Screenshot invalid)");
      return;
    }
    await handleReject(ctx, code, reason);
  }));

  // ── /find <query>
  bot.command("find", adminOnly(async (ctx) => {
    const query = ctx.message.text.split(" ").slice(1).join(" ").trim();
    if (!query) {
      await ctx.reply("Usage: /find <order code, phone, or name>");
      return;
    }
    const results = await findOrders(query);
    if (!results.length) {
      await ctx.reply(`No orders found matching "${escapeHtml(query)}".`, { parse_mode: "HTML" });
      return;
    }
    for (const o of results) {
      await ctx.reply(formatOrderSummary(o), { parse_mode: "HTML" });
    }
  }));

  // ── /resend <order_code> — re-issue invite links for approved order
  bot.command("resend", adminOnly(async (ctx) => {
    const raw = ctx.message.text.split(" ")[1];
    const code = normalizeOrderCode(raw);
    if (!code) {
      await ctx.reply("Usage: /resend <order_code> (e.g. /resend NT-8K3P9Q)");
      return;
    }
    const order = await getOrderByCode(code);
    if (!order) {
      await ctx.reply(`Order ${escapeHtml(code)} not found.`, { parse_mode: "HTML" });
      return;
    }
    if (order.status !== "approved") {
      await ctx.reply(`Order <code>${escapeHtml(code)}</code> is not approved (status: ${order.status}).`, { parse_mode: "HTML" });
      return;
    }
    try {
      await deliverAccess(ctx.telegram, order);
      await ctx.reply(`✅ Access re-sent to the student for <code>${escapeHtml(code)}</code>.`, { parse_mode: "HTML" });
      logger.info(`Admin re-sent access for ${code}`);
    } catch (err) {
      logger.error(`Resend failed for ${code}: ${err.message}`);
      await ctx.reply(`❌ Failed to resend: ${escapeHtml(err.message)}`, { parse_mode: "HTML" });
    }
  }));

  // ── /stats
  bot.command("stats", adminOnly(async (ctx) => {
    const { plans, total } = await getStats();
    let msg = `📊 <b>CSH Tutorial Sales Stats</b>\n\n`;
    for (const row of plans) {
      msg += `• ${escapeHtml(PLAN_LABELS[row.plan] || row.plan)}: ${row.count} orders — ${row.revenue} ETB\n`;
    }
    msg += `\n💰 <b>Total: ${total?.count || 0} approved orders — ${total?.revenue || 0} ETB</b>`;
    await ctx.reply(msg, { parse_mode: "HTML" });
  }));

  // ── /resetdevice [order_code] — self-service for student, or admin override
  bot.command("resetdevice", async (ctx) => {
    const raw = ctx.message?.text?.split(" ")[1];
    const code = normalizeOrderCode(raw);

    // If admin provides a specific code
    if (code && isAdmin(ctx)) {
      try {
        await resetOrderDeviceId(code);
        await ctx.reply(`✅ Device lock cleared for order <code>${escapeHtml(code)}</code>.`, { parse_mode: "HTML" });
      } catch (err) {
        await ctx.reply(`❌ Failed to reset device: ${escapeHtml(err.message)}`, { parse_mode: "HTML" });
      }
      return;
    }

    // Student self-service device reset
    const userId = ctx.from?.id || ctx.chat?.id;
    try {
      const resetCodes = await resetOrderDeviceIdByTelegramId(userId);
      if (!resetCodes || resetCodes.length === 0) {
        await ctx.reply(
          `⚠️ <b>No active subscription found.</b>\n\nOnly approved students can reset their device lock. Use /start to register or contact @Umeribnukedir.`,
          { parse_mode: "HTML" }
        );
        return;
      }
      await ctx.reply(
        `✅ <b>Device Lock Cleared Successfully!</b>\n\n` +
        `Your device binding for order <code>${escapeHtml(resetCodes[0])}</code> has been reset.\n\n` +
        `👉 You can now enter your code on your new phone, laptop, or browser to lock it there:\n` +
        `🌐 <b>Website:</b> <a href="${QUIZ_PLATFORM_URL}">${QUIZ_PLATFORM_URL}</a>`,
        { parse_mode: "HTML" }
      );
    } catch (err) {
      logger.error(`Error in /resetdevice for ${userId}: ${err.message}`);
      await ctx.reply(`⚠️ Could not reset device at this moment. Please try again or contact @Umeribnukedir.`);
    }
  });

  // ── /lock <course> <chapter>
  bot.command("lock", adminOnly(async (ctx) => {
    const parts = (ctx.message?.text || "").split(" ");
    const courseCode = parts[1]?.toUpperCase();
    const chapterNum = parseInt(parts[2], 10);

    if (!courseCode || isNaN(chapterNum)) {
      await ctx.reply("Usage: /lock <COURSE_CODE> <CHAPTER_NUM>\nExample: /lock ECON-1011 2");
      return;
    }

    try {
      const updated = await setChapterLockStatus(courseCode, chapterNum, true);
      if (!updated) {
        await ctx.reply(`⚠️ Chapter ${chapterNum} not found in course ${courseCode}.`);
        return;
      }
      clearQuizChapterCache();
      await ctx.reply(`🔒 <b>Chapter Locked:</b> ${escapeHtml(courseCode)} Chapter ${chapterNum} (${escapeHtml(updated.title)}) is now LOCKED on web and bot.`, { parse_mode: "HTML" });
    } catch (err) {
      await ctx.reply(`❌ Failed to lock chapter: ${escapeHtml(err.message)}`);
    }
  }));

  // ── /unlock <course> <chapter>
  bot.command("unlock", adminOnly(async (ctx) => {
    const parts = (ctx.message?.text || "").split(" ");
    const courseCode = parts[1]?.toUpperCase();
    const chapterNum = parseInt(parts[2], 10);

    if (!courseCode || isNaN(chapterNum)) {
      await ctx.reply("Usage: /unlock <COURSE_CODE> <CHAPTER_NUM>\nExample: /unlock ECON-1011 2");
      return;
    }

    try {
      const updated = await setChapterLockStatus(courseCode, chapterNum, false);
      if (!updated) {
        await ctx.reply(`⚠️ Chapter ${chapterNum} not found in course ${courseCode}.`);
        return;
      }
      clearQuizChapterCache();
      await ctx.reply(`🔓 <b>Chapter Unlocked:</b> ${escapeHtml(courseCode)} Chapter ${chapterNum} (${escapeHtml(updated.title)}) is now OPEN for students! 🎉`, { parse_mode: "HTML" });
    } catch (err) {
      await ctx.reply(`❌ Failed to unlock chapter: ${escapeHtml(err.message)}`);
    }
  }));

  // ── /chapters <course>
  bot.command("chapters", adminOnly(async (ctx) => {
    const courseCode = (ctx.message?.text || "").split(" ")[1]?.toUpperCase();
    if (!courseCode) {
      await ctx.reply("Usage: /chapters <COURSE_CODE>\nExample: /chapters ECON-1011");
      return;
    }

    try {
      const { course, chapters } = await getCourseChaptersStatus(courseCode);
      if (!chapters.length) {
        await ctx.reply(`No chapters found for course ${courseCode}.`);
        return;
      }
      const lines = chapters.map(ch =>
        `${ch.is_locked ? "🔒 [LOCKED]" : "🔓 [OPEN]"} Ch ${ch.chapter_number}: ${escapeHtml(ch.title)}`
      );
      await ctx.reply(
        `📚 <b>${escapeHtml(course.code)}: ${escapeHtml(course.title)}</b>\n\n${lines.join("\n")}\n\n` +
        `<i>Use /unlock ${course.code} &lt;num&gt; or /lock ${course.code} &lt;num&gt; to toggle.</i>`,
        { parse_mode: "HTML" }
      );
    } catch (err) {
      await ctx.reply(`❌ Error: ${escapeHtml(err.message)}`);
    }
  }));

  // ── /lockall — Lock ALL chapters across all courses instantly
  bot.command("lockall", adminOnly(async (ctx) => {
    try {
      await ctx.reply("⏳ Locking all chapters... please wait.");
      const count = await setAllChaptersLockStatus(true);
      clearQuizChapterCache();
      await ctx.reply(
        `🔒 <b>ALL Chapters Locked!</b>\n\n` +
        `<b>${count}</b> chapters across all courses have been locked.\n\n` +
        `Students will see a 🔒 badge on every chapter.\n` +
        `Use <code>/unlock COURSE_CODE NUM</code> to open individual chapters,\n` +
        `or <code>/unlockall</code> to open everything at once.`,
        { parse_mode: "HTML" }
      );
    } catch (err) {
      await ctx.reply(`❌ Failed to lock all chapters: ${escapeHtml(err.message)}`);
    }
  }));

  // ── /unlockall — Unlock ALL chapters across all courses instantly
  bot.command("unlockall", adminOnly(async (ctx) => {
    try {
      await ctx.reply("⏳ Unlocking all chapters... please wait.");
      const count = await setAllChaptersLockStatus(false);
      clearQuizChapterCache();
      await ctx.reply(
        `🔓 <b>ALL Chapters Unlocked!</b>\n\n` +
        `<b>${count}</b> chapters across all courses are now OPEN for students! 🎉\n\n` +
        `Students can now access every quiz immediately.\n` +
        `Use <code>/lock COURSE_CODE NUM</code> to lock specific chapters.`,
        { parse_mode: "HTML" }
      );
    } catch (err) {
      await ctx.reply(`❌ Failed to unlock all chapters: ${escapeHtml(err.message)}`);
    }
  }));

  // ── Inline button: admin_approve_NT-XXXX
  bot.action(/^admin_approve_(.+)$/, adminOnly(async (ctx) => {
    await ctx.answerCbQuery("Processing...");
    const code = ctx.match[1];
    await handleApprove(ctx, code);
  }));

  // ── Inline button: admin_reject_NT-XXXX
  bot.action(/^admin_reject_(.+)$/, adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    const code = ctx.match[1];
    await ctx.reply(
      `To reject order <code>${escapeHtml(code)}</code>, reply with:\n/reject ${escapeHtml(code)} &lt;your reason here&gt;`,
      { parse_mode: "HTML" }
    );
  }));
}

// ── Shared approve logic
async function handleApprove(ctx, code) {
  const order = await getOrderByCode(code);
  if (!order) {
    await ctx.reply(`❌ Order <code>${escapeHtml(code)}</code> not found.`, { parse_mode: "HTML" });
    return;
  }
  if (order.status === "approved") {
    await ctx.reply(`ℹ️ Order <code>${escapeHtml(code)}</code> is already approved.`, { parse_mode: "HTML" });
    return;
  }

  await updateOrderStatus(code, "approved");
  logger.info(`Order approved: ${code} by admin`);

  try {
    await deliverAccess(ctx.telegram, order);
    const safeUsername = order.telegram_username
      ? `@${escapeHtml(order.telegram_username.replace(/^@/, ""))}`
      : `ID: ${order.telegram_id}`;
    await ctx.reply(
      `✅ Order <code>${escapeHtml(code)}</code> approved and student notified!\n\n` +
      `👤 <b>Student details:</b>\n` +
      `• Name: <b>${escapeHtml(order.name)}</b>\n` +
      `• Field: ${escapeHtml(order.department || "N/A")}\n` +
      `• User: ${safeUsername}\n` +
      `• Plan: <b>${escapeHtml(PLAN_LABELS[order.plan] || order.plan)}</b>`,
      { parse_mode: "HTML" }
    );
  } catch (err) {
    logger.error(`Failed to deliver access for ${code}: ${err.message}`);
    await ctx.reply(`⚠️ Order marked approved but access delivery failed: ${escapeHtml(err.message)}\nUse /resend ${code} to retry.`, { parse_mode: "HTML" });
  }
}

// ── Shared reject logic
async function handleReject(ctx, code, reason) {
  const order = await getOrderByCode(code);
  if (!order) {
    await ctx.reply(`❌ Order <code>${escapeHtml(code)}</code> not found.`, { parse_mode: "HTML" });
    return;
  }
  if (order.status === "rejected") {
    await ctx.reply(`ℹ️ Order <code>${escapeHtml(code)}</code> is already rejected.`, { parse_mode: "HTML" });
    return;
  }

  await updateOrderStatus(code, "rejected", { reject_reason: reason });
  logger.info(`Order rejected: ${code} | Reason: ${reason}`);

  // Notify student
  try {
    await ctx.telegram.sendMessage(
      order.telegram_id,
      `❌ <b>Payment Not Confirmed</b> — Order <code>${escapeHtml(code)}</code>\n\n` +
      `Reason: ${escapeHtml(reason)}\n\n` +
      `Please contact @Umeribnukedir for help or use /start to try again.`,
      { parse_mode: "HTML" }
    );
  } catch (err) {
    logger.error(`Failed to notify student for rejected order ${code}: ${err.message}`);
  }

  await ctx.reply(`✅ Order <code>${escapeHtml(code)}</code> rejected. Student notified.`, { parse_mode: "HTML" });
}
