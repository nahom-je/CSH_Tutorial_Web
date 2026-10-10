// src/handlers/start.js — /start command
import { clearSession, getSession, setSession } from "../utils/session.js";
import { planKeyboard, fieldKeyboard, escapeHtml } from "../utils/helpers.js";
import { PLAN_LABELS, PRICING, QUIZ_PLATFORM_URL } from "../../config.js";
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

    // Parse deep-link plan param: /start sem1 /start full /start sem2
    const param = ctx.message?.text?.split(" ")[1]?.toLowerCase();

    if (param === "full" || param === "sem2") {
      await ctx.reply(
        `ℹ️ <b>Notice:</b> We currently only offer registration for the <b>Semester 1</b> plan (${PRICING.sem1} ETB).\n\n` +
        `Second semester courses will be announced once ready! Tap below to register for Semester 1:`,
        {
          parse_mode: "HTML",
          reply_markup: planKeyboard(),
        }
      );
      return;
    }

    if (param === "sem1") {
      setSession(chatId, { preselectedPlan: "sem1" });
      logger.info(`User ${chatId} started with plan=sem1`);
    }

    await ctx.reply(
      `📦 <b>Plans Available:</b>\n` +
      `• Semester 1 — ${PRICING.sem1} ETB\n\n` +
      `Type /cancel at any time to restart.\n\n` +
      `Let's get started — tap below to begin:`,
      {
        parse_mode: "HTML",
        reply_markup: planKeyboard(),
      }
    );
  });



  // /cancel
  bot.command("cancel", async (ctx) => {
    clearSession(ctx.chat.id);
    await ctx.reply("❌ Flow cancelled. Type /start whenever you're ready.");
  });

  // ── Callback: plan selection
  bot.action("plan_sem1", async (ctx) => {
    await ctx.answerCbQuery();
    setSession(ctx.chat.id, { step: "ask_name", plan: "sem1" });
    await ctx.editMessageText(
      `✅ <b>${escapeHtml(PLAN_LABELS.sem1)}</b> selected (${PRICING.sem1} ETB).\n\nPlease enter your <b>full name</b>:`,
      { parse_mode: "HTML" }
    );
  });

  // Fallback for any old inline buttons for full / sem2
  bot.action(["plan_full", "plan_sem2"], async (ctx) => {
    await ctx.answerCbQuery("ℹ️ Only Semester 1 is currently active");
    await ctx.reply(
      `ℹ️ <b>Notice:</b> We currently only offer registration for the <b>Semester 1</b> plan (${PRICING.sem1} ETB).\n\n` +
      `Tap below to register for Semester 1:`,
      {
        parse_mode: "HTML",
        reply_markup: planKeyboard(),
      }
    );
  });
}

// Legacy export — kept so any leftover imports don't crash
export function escapeMarkdown(text) {
  return String(text).replace(/[_*[\]()~`>#+=|{}.!\\-]/g, "\\$&");
}
