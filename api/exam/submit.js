import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://vexmmdlqlhakipnhoycn.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZleG1tZGxxbGhha2lwbmhveWNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTUzODM5MiwiZXhwIjoyMTA3MTE0MzkyfQ.DsNI8FAih_WpEYYfLPyZ2vhAZizF9iZ6gQWlBZz-l6o";
const BOT_TOKEN = process.env.BOT_TOKEN || "8961613390:AAFH6PSizEZW6jM7i9EYW5kfbB1Lal5QZ9k";
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || "6235744627";

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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { code, attempt_id, answers } = body;

    const normCode = normalizeOrderCode(code);
    if (!normCode || !attempt_id) {
      return res.status(400).json({ error: "order code and attempt_id are required." });
    }

    // 1. Fetch attempt
    const { data: attempt, error: attErr } = await sb
      .from("exam_attempts")
      .select("*, exam_subjects(title, code, field)")
      .eq("id", attempt_id)
      .single();

    if (attErr || !attempt) {
      return res.status(404).json({ error: "Exam attempt not found." });
    }

    if (attempt.order_code && attempt.order_code !== normCode) {
      return res.status(403).json({ error: "Attempt does not match this order code." });
    }

    // If already submitted, return saved result
    if (attempt.submitted_at != null) {
      return res.status(200).json({
        already_submitted: true,
        score: attempt.score,
        correct_count: attempt.correct_count,
        total: attempt.total,
        time_used_minutes: Math.max(
          1,
          Math.round((new Date(attempt.submitted_at) - new Date(attempt.started_at)) / 60000)
        ),
        student_name: attempt.student_name,
        subject_title: attempt.exam_subjects?.title || "Exam",
      });
    }

    // 2. Fetch questions and grade on server
    const { data: officialQuestions, error: qErr } = await sb
      .from("exam_questions")
      .select("id, correct_option")
      .eq("subject_id", attempt.subject_id);

    if (qErr) throw qErr;

    const total = officialQuestions?.length || 0;
    let correctCount = 0;
    const normalizedAnswers = typeof answers === "object" && answers !== null ? answers : {};

    for (const q of officialQuestions || []) {
      const studentChoice = normalizedAnswers[q.id] || null;
      const isCorrect =
        studentChoice &&
        studentChoice.trim().toUpperCase() === q.correct_option?.trim().toUpperCase();

      if (isCorrect) correctCount++;
    }

    // Score out of 20, rounded to 1 decimal place
    const rawScore = total > 0 ? (correctCount / total) * 20 : 0;
    const score = Math.round(rawScore * 10) / 10;
    const submittedAt = new Date().toISOString();
    const startedAt = new Date(attempt.started_at);
    const timeUsedMinutes = Math.max(1, Math.round((new Date(submittedAt) - startedAt) / 60000));

    // 3. Update attempt record
    const { error: updateErr } = await sb
      .from("exam_attempts")
      .update({
        submitted_at: submittedAt,
        answers: normalizedAnswers,
        correct_count: correctCount,
        total,
        score,
      })
      .eq("id", attempt_id);

    if (updateErr) throw updateErr;

    // 4. Send Telegram notification to admin
    const subjectTitle = attempt.exam_subjects?.title || "Exam";
    const subjectField = attempt.field || "Science";
    const submissionTimeFormatted = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Addis_Ababa",
    });

    try {
      const adminMsg =
`📝 New Exam Result
👤 Name: ${attempt.student_name}
🆔 ID: ${attempt.student_id}
📞 Phone: ${attempt.phone}
🎓 Field: ${subjectField}
📚 Subject: ${subjectTitle}
⭐ Score: ${score.toFixed(1)} / 20 (${correctCount} of ${total} correct)
⏱ Time used: ${timeUsedMinutes} min
🕒 Submitted: ${submissionTimeFormatted}
🔑 Order: ${attempt.order_code || normCode}`;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text: adminMsg,
        }),
      });
    } catch (tgErr) {
      console.warn("[Submit API] Telegram notification failed:", tgErr.message);
    }

    // Return ONLY score summary — NO answers, explanations, or reviews!
    return res.status(200).json({
      success: true,
      student_name: attempt.student_name,
      subject_title: subjectTitle,
      score,
      correct_count: correctCount,
      total,
      time_used_minutes: timeUsedMinutes,
    });
  } catch (err) {
    console.error("[Submit API] Error:", err.message);
    return res.status(500).json({ error: "Failed to submit exam. Please try again." });
  }
}
