// src/handlers/admin.js — All admin-only commands and approve/reject callbacks
import {
  getPendingOrders, getOrderByCode, updateOrderStatus,
  findOrders, getStats,
} from "../db/database.js";
import { formatOrderSummary, escapeMd, escapeHtml } from "../utils/helpers.js";
import { deliverAccess } from "../utils/delivery.js";
import { PLAN_LABELS } from "../../config.js";
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
    const orders = getPendingOrders();
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

  // ── /approve NT-XXXX
  bot.command("approve", adminOnly(async (ctx) => {
    const args = ctx.message.text.split(" ");
    const code = args[1]?.toUpperCase();
    if (!code) {
      await ctx.reply("Usage: /approve NT-XXXX");
      return;
    }
    await handleApprove(ctx, code);
  }));

  // ── /reject NT-XXXX <reason>
  bot.command("reject", adminOnly(async (ctx) => {
    const parts = ctx.message.text.split(" ");
    const code   = parts[1]?.toUpperCase();
    const reason = parts.slice(2).join(" ") || "No reason provided.";
    if (!code) {
      await ctx.reply("Usage: /reject NT-XXXX <reason>");
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
    const results = findOrders(query);
    if (!results.length) {
      await ctx.reply(`No orders found matching "${escapeHtml(query)}".`, { parse_mode: "HTML" });
      return;
    }
    for (const o of results) {
      await ctx.reply(formatOrderSummary(o), { parse_mode: "Markdown" });
    }
  }));

  // ── /resend NT-XXXX — re-issue invite links for approved order
  bot.command("resend", adminOnly(async (ctx) => {
    const code = ctx.message.text.split(" ")[1]?.toUpperCase();
    if (!code) {
      await ctx.reply("Usage: /resend NT-XXXX");
      return;
    }
    const order = getOrderByCode(code);
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
    const { plans, total } = getStats();
    let msg = `📊 <b>CSH Tutorial Sales Stats</b>\n\n`;
    for (const row of plans) {
      msg += `• ${escapeHtml(PLAN_LABELS[row.plan] || row.plan)}: ${row.count} orders — ${row.revenue} ETB\n`;
    }
    msg += `\n💰 <b>Total: ${total?.count || 0} approved orders — ${total?.revenue || 0} ETB</b>`;
    await ctx.reply(msg, { parse_mode: "HTML" });
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
  const order = getOrderByCode(code);
  if (!order) {
    await ctx.reply(`❌ Order <code>${escapeHtml(code)}</code> not found.`, { parse_mode: "HTML" });
    return;
  }
  if (order.status === "approved") {
    await ctx.reply(`ℹ️ Order <code>${escapeHtml(code)}</code> is already approved.`, { parse_mode: "HTML" });
    return;
  }

  updateOrderStatus(code, "approved");
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
  const order = getOrderByCode(code);
  if (!order) {
    await ctx.reply(`❌ Order <code>${escapeHtml(code)}</code> not found.`, { parse_mode: "HTML" });
    return;
  }
  if (order.status === "rejected") {
    await ctx.reply(`ℹ️ Order <code>${escapeHtml(code)}</code> is already rejected.`, { parse_mode: "HTML" });
    return;
  }

  updateOrderStatus(code, "rejected", { reject_reason: reason });
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
