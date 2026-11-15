import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://vexmmdlqlhakipnhoycn.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZleG1tZGxxbGhha2lwbmhveWNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTUzODM5MiwiZXhwIjoyMTA3MTE0MzkyfQ.DsNI8FAih_WpEYYfLPyZ2vhAZizF9iZ6gQWlBZz-l6o";

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function normalizeOrderCode(code) {
  if (!code) return "";
  let c = code.trim().toUpperCase().replace(/\s+/g, "");
  if (!c.startsWith("NT-")) {
    if (c.startsWith("NT")) c = "NT-" + c.slice(2);
    else c = "NT-" + c;
  }
  return c;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rawCode = req.query?.code || (req.url ? new URL(req.url, "http://localhost").searchParams.get("code") : "") || "";
    const code = normalizeOrderCode(rawCode);

    if (!code || !/^NT-[A-Z0-9]{6}$/.test(code)) {
      return res.status(400).json({ valid: false, message: "Invalid or unapproved order code." });
    }

    const { data: order, error: orderErr } = await sb
      .from("orders")
      .select("order_code, name, department, status")
      .eq("order_code", code)
      .maybeSingle();

    if (orderErr || !order || order.status !== "approved") {
      return res.status(403).json({ valid: false, message: "Invalid or unapproved order code." });
    }

    const orderField = order.department || "Natural";

    const { data: subjects, error: subErr } = await sb
      .from("exam_subjects")
      .select("id, code, title, field, duration_minutes, question_count, is_active")
      .or(`field.eq.${orderField},field.eq.Both`)
      .order("created_at", { ascending: true });

    if (subErr) throw subErr;

    const { data: attempts } = await sb
      .from("exam_attempts")
      .select("subject_id, submitted_at")
      .eq("order_code", code);

    const takenSubjectIds = new Set(
      (attempts || []).filter((a) => a.submitted_at != null).map((a) => a.subject_id)
    );

    const mappedSubjects = (subjects || []).map((sub) => {
      let status = "available";
      if (sub.is_active === false) {
        status = "closed";
      } else if (takenSubjectIds.has(sub.id)) {
        status = "taken";
      }
      return {
        id: sub.id,
        code: sub.code,
        title: sub.title,
        question_count: sub.question_count,
        duration_minutes: sub.duration_minutes,
        status,
      };
    });

    return res.status(200).json({
      valid: true,
      name: order.name,
      field: orderField,
      subjects: mappedSubjects,
    });
  } catch (err) {
    console.error("[Subjects API] Error:", err.message);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
