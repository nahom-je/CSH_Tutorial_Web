// src/db/database.js — Pure WebAssembly/JS SQLite using sql.js (no C++ build tools or native bindings required)
import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ORDER_CODE_PREFIX, ORDER_CODE_START } from "../../config.js";
import { logger } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Allow DATA_DIR override via env var (used on Render where the persistent disk
// is mounted at a specific path, not relative to the source file).
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../../data");
const DB_PATH = path.join(DATA_DIR, "orders.db");
const DB_TMP  = path.join(DATA_DIR, "orders.db.tmp");


let db;

// Atomic save: write to temp file first, then rename.
// This prevents a half-written, corrupted DB if the process is killed mid-save.
export function saveDb() {
  if (!db) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const data = db.export();
    fs.writeFileSync(DB_TMP, Buffer.from(data));
    fs.renameSync(DB_TMP, DB_PATH);
  } catch (err) {
    logger.error(`Failed to save database: ${err.message}`);
  }
}

export async function getDb() {
  if (!db) {
    const SQL = await initSqlJs();
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_PATH)) {
      try {
        const filebuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(filebuffer);
        // Quick sanity check — if corrupted this will throw
        db.run("SELECT 1");
      } catch (err) {
        logger.error(`Database file corrupted, starting fresh: ${err.message}`);
        const backupPath = `${DB_PATH}.corrupt.${Date.now()}`;
        fs.renameSync(DB_PATH, backupPath);
        logger.warn(`Corrupted DB moved to ${backupPath}`);
        db = new SQL.Database();
      }
    } else {
      db = new SQL.Database();
    }
    initSchema();
    logger.info(`Database initialized with sql.js at ${DB_PATH}`);
  }
  return db;
}

function initSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code       TEXT    UNIQUE NOT NULL,
      telegram_id      INTEGER NOT NULL,
      telegram_username TEXT,
      name             TEXT    NOT NULL,
      department       TEXT    NOT NULL,
      phone            TEXT    NOT NULL,
      plan             TEXT    NOT NULL,
      price            INTEGER NOT NULL,
      method           TEXT    NOT NULL,
      status           TEXT    NOT NULL DEFAULT 'awaiting_payment',
      reject_reason    TEXT,
      created_at       TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      reviewed_at      TEXT
    );

    CREATE TABLE IF NOT EXISTS counters (
      key   TEXT PRIMARY KEY,
      value INTEGER NOT NULL DEFAULT 0
    );

    INSERT OR IGNORE INTO counters(key, value)
    VALUES ('order_seq', ${ORDER_CODE_START - 1});
  `);
  saveDb();
}

function execParams(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();
  saveDb();
}

function getRow(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let res = null;
  if (stmt.step()) {
    res = stmt.getAsObject();
  }
  stmt.free();
  return res;
}

function getAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// ── Order helpers ────────────────────────────────────────────

export function generateOrderCode() {
  let row = getRow("SELECT value FROM counters WHERE key = 'order_seq'");
  let nextVal = (row && typeof row.value === 'number' ? row.value : ORDER_CODE_START - 1) + 1;
  execParams("UPDATE counters SET value = ? WHERE key = 'order_seq'", [nextVal]);
  return `${ORDER_CODE_PREFIX}-${nextVal}`;
}

export function createOrder(data) {
  const code = generateOrderCode();
  execParams(`
    INSERT INTO orders
      (order_code, telegram_id, telegram_username, name, department, phone, plan, price, method)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    code,
    data.telegram_id,
    data.telegram_username || null,
    data.name,
    data.department,
    data.phone,
    data.plan,
    data.price,
    data.method
  ]);
  return code;
}

export function getOrderByCode(code) {
  return getRow("SELECT * FROM orders WHERE order_code = ?", [code]);
}

export function getOpenOrderCount(telegram_id) {
  const row = getRow(
    "SELECT COUNT(*) as cnt FROM orders WHERE telegram_id = ? AND status IN ('awaiting_payment','screenshot_sent')",
    [telegram_id]
  );
  return row ? row.cnt : 0;
}

export function updateOrderStatus(code, status, extra = {}) {
  const { reject_reason } = extra;
  const now = new Date().toISOString();
  execParams(`
    UPDATE orders
    SET status = ?, reject_reason = ?, reviewed_at = ?
    WHERE order_code = ?
  `, [status, reject_reason ?? null, now, code]);
}

export function getPendingOrders() {
  return getAll("SELECT * FROM orders WHERE status IN ('awaiting_payment','screenshot_sent') ORDER BY created_at");
}

export function findOrders(query) {
  const like = `%${query}%`;
  return getAll(
    "SELECT * FROM orders WHERE order_code LIKE ? OR phone LIKE ? OR name LIKE ? ORDER BY created_at DESC LIMIT 10",
    [like, like, like]
  );
}

export function getStats() {
  const plans = getAll("SELECT plan, COUNT(*) as count, SUM(price) as revenue FROM orders WHERE status = 'approved' GROUP BY plan");
  const totalRow = getRow("SELECT COUNT(*) as count, SUM(price) as revenue FROM orders WHERE status = 'approved'");
  return {
    plans,
    total: totalRow || { count: 0, revenue: 0 },
  };
}

export function getOrdersByTelegramId(telegram_id) {
  return getAll("SELECT * FROM orders WHERE telegram_id = ? ORDER BY created_at DESC", [telegram_id]);
}
