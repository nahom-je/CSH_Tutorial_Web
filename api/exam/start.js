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

function isValidEthiopianPhone(phone) {
  const cleaned = (phone || "").replace(/[\s\-]/g, "");
  return /^(09|07)\d{8}$/.test(cleaned) || /^\+251(9|7)\d{8}$/.test(cleaned);
}

function normalizePhone(phone) {
  const cleaned = (phone || "").replace(/[\s\-]/g, "");
  if (cleaned.startsWith("+251")) return cleaned;
  if (cleaned.startsWith("0")) return "+251" + cleaned.slice(1);
  return "+251" + cleaned;
}

function isValidStudentId(id) {
  const cleaned = (id || "").trim();
  return /^[A-Za-z0-9/\-]{3,20}$/.test(cleaned);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { code, phone, student_id, subject_id } = body;

    const normCode = normalizeOrderCode(code);
    if (!normCode || !/^NT-[A-Z0-9]{6}$/.test(normCode)) {
      return res.status(400).json({ error: "Invalid or unapproved order code." });
    }

    // 1. Verify Order in database
    const { data: order, error: orderErr } = await sb
      .from("orders")
      .select("order_code, name, department, status")
      .eq("order_code", normCode)
      .maybeSingle();

    if (orderErr || !order || order.status !== "approved") {
      return res.status(403).json({ error: "Invalid or unapproved order code." });
    }

    const orderField = order.department || "Natural";

    // 2. Validate inputs
    if (!isValidEthiopianPhone(phone)) {
      return res.status(400).json({
        error: "Please enter a valid Ethiopian phone number (e.g. 09XXXXXXXX, 07XXXXXXXX, or +251...).",
      });
    }

    if (!isValidStudentId(student_id)) {
      return res.status(400).json({
        error: "Please enter a valid Student ID (3 to 20 characters).",
      });
    }

    if (!subject_id) {
      return res.status(400).json({ error: "Please select an exam subject." });
    }

    const normalizedPhone = normalizePhone(phone);
    const cleanStudentId = student_id.trim();

    // 3. Verify Subject
    const { data: subject, error: subErr } = await sb
      .from("exam_subjects")
      .select("id, code, title, field, duration_minutes, is_active")
      .eq("id", subject_id)
      .single();

    if (subErr || !subject) {
      return res.status(404).json({ error: "Subject not found." });
    }

    if (subject.is_active === false) {
      return res.status(403).json({
        error: "This exam is currently closed. Please wait for the admin's announcement.",
      });
    }

    if (subject.field !== "Both" && subject.field !== orderField) {
      return res.status(403).json({
        error: `Subject ${subject.title} is not available for ${orderField} Science.`,
      });
    }

    // 4. Check existing attempts for (order_code, subject_id)
    const { data: existingAttempts } = await sb
      .from("exam_attempts")
      .select("id, started_at, deadline_at, submitted_at, answers")
      .eq("order_code", normCode)
      .eq("subject_id", subject.id)
      .order("started_at", { ascending: false });

    const now = new Date();
    const finished = (existingAttempts || []).find((a) => a.submitted_at != null);

    if (finished) {
      return res.status(403).json({
        error: `You have already taken the exam for ${subject.title}. Only 1 attempt is allowed.`,
        already_taken: true,
      });
    }

    // Resume unfinished attempt if deadline has not passed
    const activeAttempt = (existingAttempts || []).find(
      (a) => a.submitted_at == null && new Date(a.deadline_at).getTime() > now.getTime()
    );

    let attemptRecord;
    let isResume = false;

    if (activeAttempt) {
      attemptRecord = activeAttempt;
      isResume = true;
      await sb
        .from("exam_attempts")
        .update({ phone: normalizedPhone, student_id: cleanStudentId })
        .eq("id", activeAttempt.id);
    } else {
      const durationMinutes = subject.duration_minutes || 60;
      const deadline = new Date(now.getTime() + durationMinutes * 60 * 1000);

      const attemptInsertData = {
        order_code: normCode,
        student_name: order.name,
        field: orderField,
        phone: normalizedPhone,
        student_id: cleanStudentId,
        subject_id: subject.id,
        started_at: now.toISOString(),
        deadline_at: deadline.toISOString(),
        answers: {},
      };

      const { data: newAtt, error: createErr } = await sb
        .from("exam_attempts")
        .insert(attemptInsertData)
        .select()
        .single();

      if (createErr) throw createErr;
      attemptRecord = newAtt;
    }

    // 5. Fetch questions (NEVER return correct_option or explanation!)
    const { data: questions, error: qErr } = await sb
      .from("exam_questions")
      .select("id, question_number, question_text, options")
      .eq("subject_id", subject.id)
      .order("question_number", { ascending: true });

    if (qErr) throw qErr;

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: "No questions currently loaded for this subject." });
    }

    // Deterministic shuffle by attempt id
    const seededQuestions = questions
      .map((q) => {
        let hash = 0;
        const str = (attemptRecord.id || "") + q.id;
        for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
        return { q, sortKey: hash };
      })
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((item, idx) => ({
        id: item.q.id,
        display_number: idx + 1,
        question_text: item.q.question_text,
        options: item.q.options,
      }));

    const deadlineMs = new Date(attemptRecord.deadline_at).getTime();
    const remainingSeconds = Math.max(0, Math.floor((deadlineMs - Date.now()) / 1000));

    return res.status(200).json({
      attempt_id: attemptRecord.id,
      is_resume: isResume,
      student_name: order.name,
      field: orderField,
      subject: {
        id: subject.id,
        code: subject.code,
        title: subject.title,
        duration_minutes: subject.duration_minutes,
      },
      started_at: attemptRecord.started_at,
      deadline_at: attemptRecord.deadline_at,
      remaining_seconds: remainingSeconds,
      saved_answers: attemptRecord.answers || {},
      questions: seededQuestions,
    });
  } catch (err) {
    console.error("[Start API] Error:", err.message);
    return res.status(500).json({ error: "Failed to begin exam. Please try again." });
  }
}
