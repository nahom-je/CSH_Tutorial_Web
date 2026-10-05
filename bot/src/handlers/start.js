// src/handlers/start.js — /start command
import { clearSession, getSession, setSession } from "../utils/session.js";
import { planKeyboard, fieldKeyboard } from "../utils/helpers.js";
import { PLAN_LABELS, PRICING } from "../../config.js";
import { logger } from "../utils/logger.js";

export function registerStartHandler(bot) {
  // /start [plan]
  bot.command("start", async (ctx) => {
    const chatId = ctx.chat.id;

    // ── Admin detection: if ADMIN_CHAT_ID not set yet, save it
    if (!process.env.ADMIN_CHAT_ID && String(chatId) !== "0") {
      logger.warn(`First /start from chat_id ${chatId}. If this is you (admin), set ADMIN_CHAT_ID=${chatId} in .env`);
    }

    clearSession(chatId);

    // Parse deep-link plan param: /start sem1  /start sem2  /start full
    const param = ctx.message?.text?.split(" ")[1]?.toLowerCase();
    const validPlans = ["sem1", "sem2", "full"];
    const preselectedPlan = validPlans.includes(param) ? param : null;

    if (preselectedPlan) {
      setSession(chatId, { preselectedPlan });
      logger.info(`User ${chatId} started with plan=${preselectedPlan}`);
    }

    await ctx.reply(
      `📦 *Plans Available:*\n` +
      `• Semester 1 — ${PRICING.sem1} ETB\n` +
      `• Semester 2 — ${PRICING.sem2} ETB\n` +
      `• Full Year (both) — ${PRICING.full} ETB (🔥 Save 100 ETB!)\n\n` +
      `Type /cancel at any time to restart.\n\n` +
      `Let's get started — which plan would you like?`,
      {
        parse_mode: "Markdown",
        reply_markup: planKeyboard(),
      }
    );
  });

  // /cancel
  bot.command("cancel", async (ctx) => {
    clearSession(ctx.chat.id);
    await ctx.reply(
      "❌ Flow cancelled. Type /start whenever you're ready.",
      { parse_mode: "Markdown" }
    );
  });

  // ── Callback: plan selection
  for (const plan of ["sem1", "sem2", "full"]) {
    bot.action(`plan_${plan}`, async (ctx) => {
      await ctx.answerCbQuery();
      setSession(ctx.chat.id, { step: "ask_name", plan });
      await ctx.editMessageText(
        `✅ *${PLAN_LABELS[plan]}* selected (${PRICING[plan]} ETB).\n\nPlease enter your *full name*:`,
        { parse_mode: "Markdown" }
      );
    });
  }
}

export function escapeMarkdown(text) {
  // Escape ALL MarkdownV2 special characters as required by Telegram API
  return String(text).replace(/[_*[\]()~`>#+=|{}.!\\-]/g, "\\$&");
}
