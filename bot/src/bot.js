// src/bot.js — CSH Tutorial Bot (@CSH_Tutorial_bot)
import "dotenv/config";
import http from "http";
import { Telegraf } from "telegraf";
import { getDb, saveDb } from "./db/database.js";
import { registerStartHandler }      from "./handlers/start.js";
import { registerWizardHandler }     from "./handlers/wizard.js";
import { registerScreenshotHandler } from "./handlers/screenshot.js";
import { registerAdminHandlers }     from "./handlers/admin.js";
import { logger } from "./utils/logger.js";

// ── Validate required env vars ─────────────────────────────────
const REQUIRED_ENVS = [
  "BOT_TOKEN",
  "ADMIN_CHAT_ID",
  "TELEBIRR_NUMBER",
  "CBE_ACCOUNT",
  "ACCOUNT_HOLDER_NAME",
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
    saveDb();
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
      `🤖 @${botInfo.username} started successfully\\.\n` +
      `⏰ ${new Date().toUTCString().replace(/[.!]/g, "\\$&")}\n\n` +
      `Commands: /pending /stats /find /approve /reject /resend`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    logger.warn(`Could not send boot message to admin: ${err.message}`);
  }

  // ── Start lightweight HTTP server for Render / keep-alive pings
  const PORT = process.env.PORT || 3000;
  server = http.createServer((req, res) => {
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
