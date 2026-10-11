import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { ORDER_CODE_PREFIX } from "../../config.js";
import { logger } from "../utils/logger.js";

// ── Supabase client (singleton) ─────────────────────────────────
let supabase;

function getClient() {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY; // service-role key (server side only)

  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables.");
  }

  supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  return supabase;
}

// ── Compatibility shims (bot.js calls these) ────────────────────
// getDb() is awaited at startup; after Supabase nothing needs to be loaded from disk.
export async function getDb() {
  const client = getClient();
  // Quick connectivity + schema sanity check
  const { error } = await client.from("orders").select("id").limit(1);
  if (error) {
    logger.error(`Supabase connectivity check failed: ${error.message}`);
    throw error;
  }
  logger.info("Supabase database connected and ready.");
  return client;
}

// saveDb() was called after every write in sql.js; with Supabase writes are immediate — no-op.
export function saveDb() {
  // no-op: Supabase persists every write instantly
}

// ── Order helpers ────────────────────────────────────────────────

// Non-ambiguous 32-character set (omits 0, 1, I, O to avoid manual entry confusion)
const ORDER_CODE_CHARSET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * Generate a random non-sequential order code (e.g. NT-K7P4N8, NT-8K3P9Q).
 * 6 characters from a 32-char alphabet provides ~1.07 billion combinations,
 * preventing sequential guessing while keeping codes compact and easy to type.
 */
export function generateRandomOrderCode(length = 6) {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ORDER_CODE_CHARSET[bytes[i] % ORDER_CODE_CHARSET.length];
  }
  return `${ORDER_CODE_PREFIX}-${result}`;
}

/**
 * Generates an order code and ensures uniqueness in Supabase.
 */
export async function generateOrderCode() {
  const client = getClient();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRandomOrderCode(6);
    const { data, error } = await client
      .from("orders")
      .select("id")
      .eq("order_code", code)
      .limit(1);

    if (error) {
      logger.warn(`Collision check error for ${code}: ${error.message}`);
      return code;
    }
    if (!data || data.length === 0) {
      return code;
    }
    logger.warn(`Order code collision detected for ${code}, retrying...`);
  }
  // Fallback with timestamp hex component if 5 collisions occur (astronomically unlikely)
  const hex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${ORDER_CODE_PREFIX}-${hex}`;
}

export async function createOrder(data) {
  const client = getClient();
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = await generateOrderCode();
    const { error } = await client.from("orders").insert({
      order_code:        code,
      telegram_id:       data.telegram_id,
      telegram_username: data.telegram_username || null,
      name:              data.name,
      department:        data.department,
      phone:             data.phone,
      plan:              data.plan,
      price:             data.price,
      method:            data.method,
      status:            "awaiting_payment",
    });

    if (!error) return code;

    // Retry if unique key constraint violated
    if (error.code === "23505" || error.message?.includes("duplicate key")) {
      logger.warn(`Order code collision on insert: ${code}, retrying...`);
      continue;
    }
    throw new Error(`createOrder failed: ${error.message}`);
  }
  throw new Error("createOrder failed: maximum retry attempts exceeded");
}

export async function getOrderByCode(code) {
  const client = getClient();
  const { data, error } = await client
    .from("orders")
    .select("*")
    .eq("order_code", code)
    .maybeSingle();
  if (error) throw new Error(`getOrderByCode failed: ${error.message}`);
  return data; // null if not found
}

export async function getOpenOrderCount(telegram_id) {
  const client = getClient();
  const { count, error } = await client
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("telegram_id", telegram_id)
    .in("status", ["awaiting_payment", "screenshot_sent"]);
  if (error) throw new Error(`getOpenOrderCount failed: ${error.message}`);
  return count ?? 0;
}

export async function updateOrderStatus(code, status, extra = {}) {
  const client = getClient();
  const now = new Date().toISOString();
  const { error } = await client
    .from("orders")
    .update({
      status,
      reject_reason: extra.reject_reason ?? null,
      reviewed_at:   now,
    })
    .eq("order_code", code);
  if (error) throw new Error(`updateOrderStatus failed: ${error.message}`);
}

export async function getPendingOrders() {
  const client = getClient();
  const { data, error } = await client
    .from("orders")
    .select("*")
    .in("status", ["awaiting_payment", "screenshot_sent"])
    .order("created_at", { ascending: true });
  if (error) throw new Error(`getPendingOrders failed: ${error.message}`);
  return data ?? [];
}

export async function findOrders(query) {
  const client = getClient();
  const like = `%${query}%`;
  const { data, error } = await client
    .from("orders")
    .select("*")
    .or(`order_code.ilike.${like},phone.ilike.${like},name.ilike.${like}`)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw new Error(`findOrders failed: ${error.message}`);
  return data ?? [];
}

export async function getStats() {
  const client = getClient();

  // Per-plan breakdown
  const { data: plans, error: plansErr } = await client
    .from("orders")
    .select("plan, price")
    .eq("status", "approved");
  if (plansErr) throw new Error(`getStats (plans) failed: ${plansErr.message}`);

  // Aggregate in JS (Supabase free tier doesn't support GROUP BY in the JS client easily)
  const planMap = {};
  let totalCount = 0;
  let totalRevenue = 0;
  for (const row of plans ?? []) {
    if (!planMap[row.plan]) planMap[row.plan] = { plan: row.plan, count: 0, revenue: 0 };
    planMap[row.plan].count++;
    planMap[row.plan].revenue += row.price;
    totalCount++;
    totalRevenue += row.price;
  }

  return {
    plans: Object.values(planMap),
    total: { count: totalCount, revenue: totalRevenue },
  };
}

export async function getOrdersByTelegramId(telegram_id) {
  const client = getClient();
  const { data, error } = await client
    .from("orders")
    .select("*")
    .eq("telegram_id", telegram_id)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`getOrdersByTelegramId failed: ${error.message}`);
  return data ?? [];
}

/**
 * Bind an order to a specific device_id
 */
export async function setOrderDeviceId(code, deviceId) {
  const client = getClient();
  const { error } = await client
    .from("orders")
    .update({ device_id: deviceId })
    .eq("order_code", code);
  if (error) {
    logger.warn(`setOrderDeviceId note: ${error.message}`);
    return false;
  }
  return true;
}

/**
 * Clear the device_id binding for an order code
 */
export async function resetOrderDeviceId(code) {
  const client = getClient();
  const { error } = await client
    .from("orders")
    .update({ device_id: null })
    .eq("order_code", code);
  if (error) throw new Error(`resetOrderDeviceId failed: ${error.message}`);
  return true;
}

/**
 * Clear the device_id binding by telegram_id (for the student's active approved order)
 */
export async function resetOrderDeviceIdByTelegramId(telegramId) {
  const client = getClient();
  const { data: orders, error: fetchErr } = await client
    .from("orders")
    .select("order_code, status")
    .eq("telegram_id", telegramId)
    .eq("status", "approved");

  if (fetchErr) throw new Error(`resetOrderDeviceIdByTelegramId query failed: ${fetchErr.message}`);
  if (!orders || orders.length === 0) return null;

  const codes = orders.map(o => o.order_code);
  const { error: updateErr } = await client
    .from("orders")
    .update({ device_id: null })
    .in("order_code", codes);

  if (updateErr) throw new Error(`resetOrderDeviceIdByTelegramId update failed: ${updateErr.message}`);
  return codes;
}

/**
 * Set lock status for a course chapter (e.g. courseCode = "ECON-1011", chapterNumber = 2, isLocked = false)
 */
export async function setChapterLockStatus(courseCode, chapterNumber, isLocked) {
  const client = getClient();
  // Find course first
  const { data: course, error: courseErr } = await client
    .from("courses")
    .select("id")
    .ilike("code", courseCode)
    .maybeSingle();

  if (courseErr || !course) throw new Error(`Course not found: ${courseCode}`);

  const { data, error } = await client
    .from("chapters")
    .update({ is_locked: isLocked })
    .eq("course_id", course.id)
    .eq("chapter_number", chapterNumber)
    .select("id, chapter_number, title, is_locked");

  if (error) throw new Error(`setChapterLockStatus failed: ${error.message}`);
  return data && data[0] ? data[0] : null;
}

/**
 * Get all chapters for a course with lock status
 */
export async function getCourseChaptersStatus(courseCode) {
  const client = getClient();
  const { data: course, error: courseErr } = await client
    .from("courses")
    .select("id, code, title")
    .ilike("code", courseCode)
    .maybeSingle();

  if (courseErr || !course) throw new Error(`Course not found: ${courseCode}`);

  const { data: chs, error: chsErr } = await client
    .from("chapters")
    .select("id, chapter_number, title, is_locked")
    .eq("course_id", course.id)
    .order("chapter_number");

  if (chsErr) throw new Error(`getCourseChaptersStatus failed: ${chsErr.message}`);
  return { course, chapters: chs || [] };
}

/**
 * Lock or unlock ALL chapters across every course in the platform in one query.
 * Returns { locked: N, unlocked: N } counts for the opposite of what was set.
 */
export async function setAllChaptersLockStatus(isLocked) {
  const client = getClient();
  const { data, error } = await client
    .from("chapters")
    .update({ is_locked: isLocked })
    .neq("id", "00000000-0000-0000-0000-000000000000") // match all rows
    .select("id");

  if (error) throw new Error(`setAllChaptersLockStatus failed: ${error.message}`);
  return data?.length ?? 0;
}

