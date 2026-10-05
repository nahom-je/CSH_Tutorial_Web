// src/handlers/screenshot.js — "I've sent the screenshot" button handler
import { getSession, clearSession } from "../utils/session.js";
import { getOrderByCode, updateOrderStatus } from "../db/database.js";
import { adminApproveRejectKeyboard, formatAdminNotification } from "../utils/helpers.js";
import { escapeMarkdown } from "./start.js";
import { logger } from "../utils/logger.js";

export function registerScreenshotHandler(bot) {
  // Matches callback_data: screenshot_sent_NT-XXXX
  bot.action(/^screenshot_sent_(.+)$/, async (ctx) => {
    await ctx.answerCbQuery("✅ Got it! Notifying admin...");

    const orderCode = ctx.match[1];
    const chatId    = ctx.chat.id;
    const session   = getSession(chatId);

    // Guard: make sure this order belongs to this user
    const order = getOrderByCode(orderCode);
    if (!order || String(order.telegram_id) !== String(chatId)) {
      await ctx.reply("❌ Could not find your order\\. Please use /start to try again\\.", { parse_mode: "MarkdownV2" });
      return;
    }

    if (order.status !== "awaiting_payment") {
      await ctx.reply(
        `ℹ️ Your order *\`${escapeMarkdown(orderCode)}\`* is already marked as *${escapeMarkdown(order.status)}*\\.`,
        { parse_mode: "MarkdownV2" }
      );
      return;
    }

    // Update status
    updateOrderStatus(orderCode, "screenshot_sent");
    logger.info(`Screenshot sent notification: ${orderCode} by ${chatId}`);

    // Notify admin
    const adminId = process.env.ADMIN_CHAT_ID;
    if (adminId) {
      try {
        await ctx.telegram.sendMessage(
          adminId,
          formatAdminNotification({ ...order, status: "screenshot_sent" }),
          {
            parse_mode: "Markdown",
            reply_markup: adminApproveRejectKeyboard(orderCode),
          }
        );
      } catch (err) {
        logger.error(`Failed to notify admin: ${err.message}`);
      }
    }

    // Confirm to student
    await ctx.editMessageText(
      `📩 *Got it\\!* I've notified the admin about your payment for order \`${escapeMarkdown(orderCode)}\`\\.\n\n` +
      `⏳ Your access will be sent here once your payment is verified\\. This usually takes *a few hours* on business days\\.\n\n` +
      `If you have questions, message *@Umeribnukedir* directly\\.`,
      { parse_mode: "MarkdownV2" }
    );

    clearSession(chatId);
  });
}
