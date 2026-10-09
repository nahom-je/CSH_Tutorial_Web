// src/bot.js — CSH Tutorial Bot (@CSH_Tutorial_bot)
import "dotenv/config";
import http from "http";
import { Telegraf } from "telegraf";
import { getDb, saveDb, getOrderByCode } from "./db/database.js";
import { generateQuizToken, normalizeOrderCode } from "./utils/token.js";

import { registerStartHandler }      from "./handlers/start.js";
import { registerWizardHandler }     from "./handlers/wizard.js";
import { registerScreenshotHandler } from "./handlers/screenshot.js";
import { registerAdminHandlers }     from "./handlers/admin.js";
import { registerQuizHandler }      from "./handlers/quiz.js";
import { logger } from "./utils/logger.js";


// ── Validate required env vars ─────────────────────────────────
const REQUIRED_ENVS = [
  "BOT_TOKEN",
  "ADMIN_CHAT_ID",
  "TELEBIRR_NUMBER",
  "CBE_ACCOUNT",
  "ACCOUNT_HOLDER_NAME",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_KEY",
];

const missing = REQUIRED_ENVS.filter((key) => !process.env[key]);
if (!process.env.PRIVATE_CHANNEL_ID && !process.env.CHANNEL_SEM1_ID) {
  missing.push("PRIVATE_CHANNEL_ID");
}

if (missing.length > 0) {
  logger.error(`Missing required environment variables: ${missing.join(", ")}`);
  logger.error("Copy bot/.env.example to bot/.env and fill in all values before starting.");
  process.exit(1);
}

// ── Main Async Starter ──────────────────────────────────────────
async function startBot() {
  // ── Init DB
  await getDb();

  // ── Create bot
  const bot = new Telegraf(process.env.BOT_TOKEN);

  // ── Set default description shown before /start is pressed
  try {
    await bot.telegram.setMyDescription(
      "👋 Welcome to the CSH Tutorial Registration Bot (2019 E.C.)!\n\n" +
      "Use this official bot to:\n" +
      "• Register for the CSH Tutorial private channel\n" +
      "• Submit your details\n" +
      "• Send your payment receipt\n\n" +
      "👇 Tap START below to begin your registration."
    );
  } catch (err) {
    logger.warn(`Could not set bot description: ${err.message}`);
  }

  // ── Register handlers (order matters)
  registerStartHandler(bot);
  registerAdminHandlers(bot);   // register admin BEFORE wizard so /approve etc. don't fall through
  registerScreenshotHandler(bot);
  registerQuizHandler(bot);     // interactive in-bot chapter quizzes
  registerWizardHandler(bot);   // catch-all text handler — must be last


  // ── Global error handler — never crash
  bot.catch((err, ctx) => {
    logger.error(`Bot error for ${ctx?.updateType}: ${err.message}\n${err.stack}`);
    try {
      ctx?.reply?.("⚠️ Something went wrong on our end. Please try again or contact @Umeribnukedir.");
    } catch (_) {}
  });

  // ── Graceful shutdown: save DB and close server before exit
  let server;
  const shutdown = (signal) => {
    logger.info(`${signal} received, saving DB and stopping bot...`);
    try { server?.close(); } catch (_) {}
    saveDb(); // no-op with Supabase; kept for compatibility
    bot.stop(signal);
    process.exit(0);
  };
  process.once("SIGINT",  () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));

  // ── Get bot details & notify admin on boot
  const botInfo = await bot.telegram.getMe();
  bot.botInfo = botInfo;
  logger.info(`CSH Tutorial Bot (@${botInfo.username}) is now ONLINE and ready!`);

  try {
    await bot.telegram.sendMessage(
      process.env.ADMIN_CHAT_ID,
      `✅ *CSH Tutorial Bot is ONLINE*\n\n` +
      `🤖 @${(botInfo.username || "").replace(/_/g, "\\_")} started successfully\\.\n` +
      `⏰ ${new Date().toUTCString().replace(/[.!]/g, "\\$&")}\n\n` +
      `Commands: /pending /stats /find /approve /reject /resend`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    logger.warn(`Could not send boot message to admin: ${err.message}`);
  }

  // ── Start lightweight HTTP server for Render / keep-alive pings & order verification
  const PORT = process.env.PORT || 3000;
  server = http.createServer((req, res) => {
    // Enable CORS for web frontend
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const host = req.headers.host || `localhost:${PORT}`;
    const url = new URL(req.url, `http://${host}`);

    if (url.pathname === "/api/verify-order") {
      const rawCode = url.searchParams.get("code") || "";
      const normalized = normalizeOrderCode(rawCode);

      if (!normalized) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ valid: false, message: "Please provide an order code (e.g. NT-1001)." }));
        return;
      }

      // Async handler wrapped so we can await getOrderByCode
      (async () => {
        try {
          const order = await getOrderByCode(normalized);
          if (!order) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ valid: false, message: `Order code ${normalized} not found.` }));
            return;
          }

          if (order.status !== "approved") {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
              valid: false,
              status: order.status,
              message: order.status === "awaiting_payment"
                ? "Order is awaiting payment verification by admin."
                : "Order is pending admin approval."
            }));
            return;
          }

          const token = generateQuizToken(normalized);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            valid: true,
            order_code: order.order_code,
            name: order.name,
            plan: order.plan,
            token
          }));
        } catch (err) {
          logger.error(`/api/verify-order error: ${err.message}`);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ valid: false, message: "Internal server error." }));
        }
      })();
      return;
    }

    // Default health check
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "ok",
      bot: `@${botInfo.username}`,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }));
  });


  server.listen(PORT, () => {
    logger.info(`Health check web server running on port ${PORT}`);
  });

  // ── Launch
  bot.launch().catch((err) => {
    logger.error(`Bot polling error: ${err.message}`);
  });
}

startBot().catch((err) => {
  logger.error(`Failed to start bot: ${err.message}`);
  process.exit(1);
});
