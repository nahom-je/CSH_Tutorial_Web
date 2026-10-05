// src/handlers/admin.js — All admin-only commands and approve/reject callbacks
import {
  getPendingOrders, getOrderByCode, updateOrderStatus,
  findOrders, getStats,
} from "../db/database.js";
import { formatOrderSummary } from "../utils/helpers.js";
import { deliverAccess } from "../utils/delivery.js";
import { escapeMarkdown } from "./start.js";
import { PLAN_LABELS } from "../../config.js";
import { logger } from "../utils/logger.js";

function isAdmin(ctx) {
  const adminId = process.env.ADMIN_CHAT_ID;
  // Check BOTH ctx.from.id (who clicked) and ctx.chat.id (direct messages)
  // ctx.from is always the actual user; ctx.chat can be misleading in groups
  const fromId = String(ctx.from?.id ?? "");
  const chatId = String(ctx.chat?.id ?? "");
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
      `🆔 \`${o.order_code}\` | ${o.name} | ${PLAN_LABELS[o.plan]} | ${o.price} ETB | Status: ${o.status}`
    );
    await ctx.reply(
      `📋 *Pending Orders (${orders.length})*\n\n${lines.join("\n")}`,
      { parse_mode: "Markdown" }
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
      await ctx.reply(`No orders found matching "${query}".`);
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
      await ctx.reply(`Order ${code} not found.`);
      return;
    }
    if (order.status !== "approved") {
      await ctx.reply(`Order ${code} is not approved (status: ${order.status}).`);
      return;
    }
    try {
      await deliverAccess(ctx.telegram, order);
      await ctx.reply(`✅ Access re-sent to the student for ${code}.`);
      logger.info(`Admin re-sent access for ${code}`);
    } catch (err) {
      logger.error(`Resend failed for ${code}: ${err.message}`);
      await ctx.reply(`❌ Failed to resend: ${err.message}`);
    }
  }));

  // ── /stats
  bot.command("stats", adminOnly(async (ctx) => {
    const { plans, total } = getStats();
    let msg = `📊 *CSH Tutorial Sales Stats*\n\n`;
    for (const row of plans) {
      msg += `• ${PLAN_LABELS[row.plan]}: ${row.count} orders — ${row.revenue} ETB\n`;
    }
    msg += `\n💰 *Total: ${total?.count || 0} approved orders — ${total?.revenue || 0} ETB*`;
    await ctx.reply(msg, { parse_mode: "Markdown" });
  }));

  // ── Inline button: admin_approve_NT-XXXX
  bot.action(/^admin_approve_(.+)$/, adminOnly(async (ctx) => {
    await ctx.answerCbQuery("Processing...");
    const code = ctx.match[1];
    await handleApprove(ctx, code);
  }));

  // ── Inline button: admin_reject_NT-XXXX  (asks for reason via follow-up message)
  bot.action(/^admin_reject_(.+)$/, adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    const code = ctx.match[1];
    await ctx.reply(
      `To reject order \`${code}\`, reply with:\n/reject ${code} <your reason here>`,
      { parse_mode: "Markdown" }
    );
  }));
}

// ── Shared approve logic
async function handleApprove(ctx, code) {
  const order = getOrderByCode(code);
  if (!order) {
    await ctx.reply(`❌ Order \`${code}\` not found.`, { parse_mode: "Markdown" });
    return;
  }
  if (order.status === "approved") {
    await ctx.reply(`ℹ️ Order \`${code}\` is already approved.`, { parse_mode: "Markdown" });
    return;
  }

  updateOrderStatus(code, "approved");
  logger.info(`Order approved: ${code} by admin`);

  try {
    await deliverAccess(ctx.telegram, order);
    const userHandle = order.telegram_username ? `@${order.telegram_username.replace(/^@/, "")}` : `ID: ${order.telegram_id}`;
    await ctx.reply(
      `✅ Order \`${code}\` approved and student notified!\n\n` +
      `👤 *Student details:*\n` +
      `• Name: *${order.name}*\n` +
      `• Field: ${order.department || "N/A"}\n` +
      `• User: ${userHandle}\n` +
      `• Plan: *${PLAN_LABELS[order.plan]}*`,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    logger.error(`Failed to deliver access for ${code}: ${err.message}`);
    await ctx.reply(`⚠️ Order marked approved but access delivery failed: ${err.message}\nUse /resend ${code} to retry.`);
  }
}

// ── Shared reject logic
async function handleReject(ctx, code, reason) {
  const order = getOrderByCode(code);
  if (!order) {
    await ctx.reply(`❌ Order \`${code}\` not found.`, { parse_mode: "Markdown" });
    return;
  }
  if (order.status === "rejected") {
    await ctx.reply(`ℹ️ Order \`${code}\` is already rejected.`, { parse_mode: "Markdown" });
    return;
  }

  updateOrderStatus(code, "rejected", { reject_reason: reason });
  logger.info(`Order rejected: ${code} | Reason: ${reason}`);

  // Notify student
  try {
    await ctx.telegram.sendMessage(
      order.telegram_id,
      `❌ *Payment Not Confirmed* — Order \`${escapeMarkdown(code)}\`\n\n` +
      `Reason: ${escapeMarkdown(reason)}\n\n` +
      `Please contact @Umeribnukedir for help or use /start to try again\\.`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    logger.error(`Failed to notify student for rejected order ${code}: ${err.message}`);
  }

  await ctx.reply(`✅ Order \`${code}\` rejected. Student notified.`, { parse_mode: "Markdown" });
}
