// src/handlers/wizard.js — Collects name, username, field → summary → payment method → payment details → order
import { getSession, setSession, clearSession } from "../utils/session.js";
import {
  isValidName, isValidUsername,
  paymentMethodKeyboard, screenshotKeyboard,
  coursesForPlanHtml, fieldKeyboard, usernameConfirmKeyboard,
  escapeHtml,
} from "../utils/helpers.js";
import { PRICING, PLAN_LABELS } from "../../config.js";
import { createOrder, getOpenOrderCount } from "../db/database.js";
import { MAX_OPEN_ORDERS } from "../../config.js";
import { logger } from "../utils/logger.js";

const UNSUPPORTED_TYPES = ["photo", "sticker", "voice", "video", "document", "audio", "video_note", "animation"];

export function registerWizardHandler(bot) {

  // ── Catch-all text message handler (drives the wizard)
  bot.on("message", async (ctx, next) => {
    const chatId  = ctx.chat.id;
    const session = getSession(chatId);

    // Pass non-text (photos, stickers, etc.) to a friendly reply, NOT a crash
    const type = ctx.message ? Object.keys(ctx.message).find(k => UNSUPPORTED_TYPES.includes(k)) : null;
    if (type) {
      const stepsNeedingText = ["ask_name", "ask_username", "confirm_username"];
      if (stepsNeedingText.includes(session.step)) {
        await ctx.reply(
          "⚠️ I can only accept <b>text</b> at this step. Please type your response.",
          { parse_mode: "HTML" }
        );
        return;
      }
      return next();
    }

    if (!ctx.message?.text) return next();
    const text = ctx.message.text.trim();

    switch (session.step) {

      // ── Step 1: collect full name
      case "ask_name": {
        if (!isValidName(text)) {
          await ctx.reply("⚠️ Please enter your <b>full name</b> (at least 3 characters).", { parse_mode: "HTML" });
          return;
        }

        // Auto-detect Telegram username if available
        const autoUsername = ctx.from?.username ? ctx.from.username.replace(/^@/, "") : "";

        if (autoUsername) {
          setSession(chatId, { name: text, detected_username: autoUsername, step: "confirm_username" });
          await ctx.reply(
            `✈️ Is this your Telegram username: <b>@${escapeHtml(autoUsername)}</b>?`,
            {
              parse_mode: "HTML",
              reply_markup: usernameConfirmKeyboard(),
            }
          );
        } else {
          setSession(chatId, { name: text, step: "ask_username" });
          await ctx.reply(
            "✈️ What is your <b>Telegram username</b>? (e.g. <code>@username</code>):",
            { parse_mode: "HTML" }
          );
        }
        break;
      }

      // ── Step 2a: user typed text instead of clicking Yes/No on username confirmation
      case "confirm_username": {
        if (isValidUsername(text)) {
          const cleanUsername = text.replace(/^@/, "");
          setSession(chatId, { telegram_username: cleanUsername, step: "ask_field" });
          await ctx.reply(
            `✅ Username set to <b>@${escapeHtml(cleanUsername)}</b>.\n\n🎓 What is your field: <b>Social</b> or <b>Natural</b>?`,
            {
              parse_mode: "HTML",
              reply_markup: fieldKeyboard(),
            }
          );
        } else {
          await ctx.reply(
            "Please tap <b>Yes, continue</b> above or type a valid Telegram username (e.g. <code>@username</code>).",
            {
              parse_mode: "HTML",
              reply_markup: usernameConfirmKeyboard(),
            }
          );
        }
        break;
      }

      // ── Step 2b: collect typed Telegram username → ask field
      case "ask_username": {
        if (!isValidUsername(text)) {
          await ctx.reply("⚠️ Please enter a valid <b>Telegram username</b> (e.g. <code>@your_username</code>).", { parse_mode: "HTML" });
          return;
        }
        const cleanUsername = text.replace(/^@/, "");
        setSession(chatId, { telegram_username: cleanUsername, step: "ask_field" });
        await ctx.reply(
          "🎓 What is your field: <b>Social</b> or <b>Natural</b>?",
          {
            parse_mode: "HTML",
            reply_markup: fieldKeyboard(),
          }
        );
        break;
      }

      default:
        return next();
    }
  });

  // ── Callback: confirm detected username (Yes / No)
  bot.action("username_yes", async (ctx) => {
    await ctx.answerCbQuery();
    const chatId  = ctx.chat.id;
    const session = getSession(chatId);

    const username = session.detected_username || ctx.from?.username?.replace(/^@/, "") || "";
    if (!username) {
      setSession(chatId, { step: "ask_username" });
      await ctx.editMessageText("✈️ Please enter your <b>Telegram username</b> (e.g. <code>@username</code>):", { parse_mode: "HTML" });
      return;
    }

    setSession(chatId, { telegram_username: username, step: "ask_field" });
    await ctx.editMessageText(
      `✅ Username set to <b>@${escapeHtml(username)}</b>.\n\n🎓 What is your field: <b>Social</b> or <b>Natural</b>?`,
      {
        parse_mode: "HTML",
        reply_markup: fieldKeyboard(),
      }
    );
  });

  bot.action("username_no", async (ctx) => {
    await ctx.answerCbQuery();
    const chatId = ctx.chat.id;
    setSession(chatId, { step: "ask_username" });
    await ctx.editMessageText(
      "✏️ Please enter your <b>Telegram username</b> (e.g. <code>@username</code>):",
      { parse_mode: "HTML" }
    );
  });

  // ── Callback: field selection (Social / Natural)
  bot.action("field_social", (ctx) => handleFieldChoice(ctx, "Social"));
  bot.action("field_natural", (ctx) => handleFieldChoice(ctx, "Natural"));

  // ── Callback: payment method selection
  bot.action("pay_telebirr", (ctx) => handleMethodChoice(ctx, "telebirr"));
  bot.action("pay_cbe",      (ctx) => handleMethodChoice(ctx, "cbe"));
}

// ── Field chosen → show summary + payment method
async function handleFieldChoice(ctx, field) {
  await ctx.answerCbQuery();
  const chatId  = ctx.chat.id;
  const session = getSession(chatId);

  if (session.step !== "ask_field") {
    await ctx.reply("Please start from the beginning with /start.", { parse_mode: "HTML" });
    return;
  }

  // Check open order limit
  const openCount = getOpenOrderCount(chatId);
  if (openCount >= MAX_OPEN_ORDERS) {
    await ctx.editMessageText(
      `🚫 You already have <b>${openCount}</b> open orders. Please contact @Umeribnukedir to resolve them before placing a new one.`,
      { parse_mode: "HTML" }
    );
    clearSession(chatId);
    return;
  }

  const { plan, name, telegram_username } = session;
  let activePlan = plan || "sem1";
  let notice = "";
  if (field === "Social" && activePlan !== "sem1") {
    activePlan = "sem1";
    notice = `ℹ️ <i>Note: Semester 2 courses are only available for Natural Science. Your plan has been adjusted to <b>Semester 1</b> (${PRICING.sem1} ETB).</i>\n\n`;
  }

  setSession(chatId, { field, plan: activePlan, step: "choose_method" });

  const safeUsername = telegram_username ? escapeHtml(telegram_username.replace(/^@/, "")) : "N/A";
  const summary =
    `📋 <b>Order Preview</b>\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👤 Name: ${escapeHtml(name)}\n` +
    `✈️ Username: @${safeUsername}\n` +
    `🎓 Field: ${escapeHtml(field)}\n` +
    `📦 Plan: <b>${escapeHtml(PLAN_LABELS[activePlan] || activePlan)}</b>\n` +
    `💰 Price: <b>${PRICING[activePlan]} ETB</b>\n\n` +
    notice +
    `${coursesForPlanHtml(activePlan, field)}\n\n` +
    `Looks good? Choose your payment method:`;

  await ctx.editMessageText(summary, {
    parse_mode: "HTML",
    reply_markup: paymentMethodKeyboard(),
  });
}

// ── Payment method chosen → show payment details → create order
async function handleMethodChoice(ctx, method) {
  await ctx.answerCbQuery();
  const chatId  = ctx.chat.id;
  const session = getSession(chatId);

  if (session.step !== "choose_method") {
    await ctx.reply("Please start from the beginning with /start.", { parse_mode: "HTML" });
    return;
  }

  const { plan, name, telegram_username, field } = session;
  const price = PRICING[plan];

  let accountLine;
  if (method === "telebirr") {
    accountLine = `📱 <b>TeleBirr Number:</b> <code>${escapeHtml(process.env.TELEBIRR_NUMBER)}</code>`;
  } else {
    accountLine = `🏦 <b>CBE Account:</b> <code>${escapeHtml(process.env.CBE_ACCOUNT)}</code>`;
  }
  const holderName = process.env.ACCOUNT_HOLDER_NAME;

  // Create order in DB
  const orderCode = createOrder({
    telegram_id:       chatId,
    telegram_username: telegram_username || ctx.from?.username || null,
    name,
    department:        field || "CSH Student",
    phone:             "N/A",
    plan,
    price,
    method,
  });

  setSession(chatId, { orderCode, step: "awaiting_screenshot" });
  logger.info(`Order created: ${orderCode} by ${chatId} (${name})`);

  const msg =
    `✅ <b>Order Created!</b> Your order code is: <code>${orderCode}</code>\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💳 <b>Payment Details</b>\n` +
    `${accountLine}\n` +
    `👤 Account Holder: <b>${escapeHtml(holderName)}</b>\n` +
    `💰 Exact Amount: <b>${price} ETB</b>\n\n` +
    `⚠️ <b>Safety Notice:</b> Only pay to the account holder name shown above. Nobody else is authorized to collect payments for CSH Tutorial.\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📸 <b>Next Step:</b>\n` +
    `Send your payment screenshot to <b>@Umeribnukedir</b> on Telegram. In the same message, write:\n` +
    `• Your order code: <code>${orderCode}</code>\n` +
    `• Your full name: ${escapeHtml(name)}\n\n` +
    `Your access will be delivered here once payment is verified.`;

  await ctx.editMessageText(msg, {
    parse_mode: "HTML",
    reply_markup: screenshotKeyboard(orderCode),
  });
}
