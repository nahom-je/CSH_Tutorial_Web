// src/db/database.js — Supabase-backed persistent storage (replaces sql.js)
import { createClient } from "@supabase/supabase-js";
import { ORDER_CODE_PREFIX, ORDER_CODE_START } from "../../config.js";
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

/**
 * Generate the next order code atomically using an RPC that increments and returns
 * the counter in a single round-trip, avoiding race conditions.
 */
export async function generateOrderCode() {
  const client = getClient();
  const { data, error } = await client.rpc("next_order_seq");
  if (error) throw new Error(`generateOrderCode RPC failed: ${error.message}`);
  const nextVal = data; // integer returned by the SQL function
  return `${ORDER_CODE_PREFIX}-${nextVal}`;
}

export async function createOrder(data) {
  const client = getClient();
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
  if (error) throw new Error(`createOrder failed: ${error.message}`);
  return code;
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
