// src/utils/logger.js — Simple file + console logger
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR  = path.join(__dirname, "../../logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function write(level, message) {
  const ts   = new Date().toISOString();
  const line = `[${ts}] [${level}] ${message}\n`;
  process.stdout.write(line);
  fs.appendFileSync(LOG_FILE, line);
}

export const logger = {
  info:  (msg) => write("INFO",  msg),
  warn:  (msg) => write("WARN",  msg),
  error: (msg) => write("ERROR", msg),
};
