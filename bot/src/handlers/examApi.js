// src/handlers/examApi.js — Mock Exam API & Telegram Admin Handlers
import { createClient } from "@supabase/supabase-js";
import { logger } from "../utils/logger.js";

// ── Configuration ─────────────────────────────────────────────
export const MAX_ATTEMPTS_PER_SUBJECT = 1;
export const SHOW_REVIEW = process.env.SHOW_REVIEW !== "false"; // default true
const GRACE_PERIOD_MS = 15000; // 15 seconds network grace period

// ── Supabase Client (Service Role for full backend authority) ─
const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── In-Memory Rate Limiter (Max 40 requests/min per IP) ───────
const rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = 40;

  let record = rateLimitMap.get(ip);
  if (!record || now - record.startTime > windowMs) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return false;
  }

  record.count += 1;
  return record.count > maxReq;
}

// Clean old rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.startTime > 60 * 1000) rateLimitMap.delete(ip);
  }
}, 10 * 60 * 1000);

// ── Ethiopian Phone Validator ─────────────────────────────────
function isValidEthiopianPhone(phone) {
  const cleaned = (phone || "").replace(/\s+/g, "");
  return /^(09|07)\d{8}$/.test(cleaned) || /^\+251(9|7)\d{8}$/.test(cleaned);
}

// ── Student ID Validator (Format: RU/XXXX/XX) ──────────────────
function isValidStudentId(id) {
  const cleaned = (id || "").trim();
  return /^RU\/[A-Z0-9]{3,6}\/\d{2}$/i.test(cleaned);
}

// ── Helper to Read JSON Body ──────────────────────────────────
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

// ── Main HTTP API Handler for /api/exam/* ─────────────────────
export async function handleExamApi(req, res, url, bot) {
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";

  if (isRateLimited(clientIp)) {
    res.writeHead(429, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Too many requests. Please slow down." }));
    return true;
  }

  // 1. GET /api/exam/subjects
  if (req.method === "GET" && url.pathname === "/api/exam/subjects") {
    try {
      const field = url.searchParams.get("field"); // 'Natural' or 'Social' (optional)
      let query = sb
        .from("exam_subjects")
        .select("id, code, title, field, duration_minutes, question_count, is_active")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (field && ["Natural", "Social"].includes(field)) {
        query = query.or(`field.eq.${field},field.eq.Both`);
      }

      const { data: subjects, error } = await query;
      if (error) throw error;

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ subjects: subjects || [] }));
    } catch (err) {
      logger.error(`[ExamApi] /api/exam/subjects error: ${err.message}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to load subjects." }));
    }
    return true;
  }

  // 2. POST /api/exam/start
  if (req.method === "POST" && url.pathname === "/api/exam/start") {
    try {
      const body = await readJsonBody(req);
      const { student_name, student_id, phone, field, subject_id } = body;

      // Validation
      if (!student_name?.trim() || student_name.trim().length < 3) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Full name must be at least 3 characters." }));
        return true;
      }
      if (!student_id?.trim() || !isValidStudentId(student_id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Student ID must be in the format RU/XXXX/XX (e.g. RU/1234/17)." }));
        return true;
      }
      if (!isValidEthiopianPhone(phone)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Valid Ethiopian phone number required (e.g. 09XXXXXXXX, 07XXXXXXXX, or +251...)." }));
        return true;
      }
      if (!["Natural", "Social"].includes(field)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Field must be Natural or Social." }));
        return true;
      }
      if (!subject_id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "subject_id is required." }));
        return true;
      }

      const cleanName = student_name.trim();
      const cleanId = student_id.trim().toUpperCase();
      const cleanPhone = phone.trim();

      // Verify subject
      const { data: subject, error: subErr } = await sb
        .from("exam_subjects")
        .select("id, code, title, field, duration_minutes, is_active")
        .eq("id", subject_id)
        .eq("is_active", true)
        .single();

      if (subErr || !subject) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Subject not found or currently inactive." }));
        return true;
      }

      // Check stream alignment
      if (subject.field !== "Both" && subject.field !== field) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Subject ${subject.title} is not available for ${field} Science.` }));
        return true;
      }

      // Check existing attempts for (student_id, subject_id)
      const { data: existingAttempts, error: attErr } = await sb
        .from("exam_attempts")
        .select("id, started_at, deadline_at, submitted_at, answers")
        .eq("student_id", cleanId)
        .eq("subject_id", subject_id)
        .order("started_at", { ascending: false });

      if (attErr) throw attErr;

      const now = new Date();
      const submitted = existingAttempts?.find((a) => a.submitted_at != null);

      if (submitted && MAX_ATTEMPTS_PER_SUBJECT <= 1) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          error: `You have already completed the exam for ${subject.title}. Maximum ${MAX_ATTEMPTS_PER_SUBJECT} attempt allowed per student.`,
          completed: true
        }));
        return true;
      }

      // Check for active in-progress attempt to RESUME
      const activeAttempt = existingAttempts?.find(
        (a) => a.submitted_at == null && new Date(a.deadline_at).getTime() > now.getTime()
      );

      let attemptRecord;
      let isResume = false;

      if (activeAttempt) {
        attemptRecord = activeAttempt;
        isResume = true;
      } else {
        // Create new attempt
        const durationMinutes = subject.duration_minutes || 60;
        const deadline = new Date(now.getTime() + durationMinutes * 60 * 1000);

        const { data: newAtt, error: createErr } = await sb
          .from("exam_attempts")
          .insert({
            student_name: cleanName,
            student_id: cleanId,
            phone: cleanPhone,
            field,
            subject_id: subject.id,
            started_at: now.toISOString(),
            deadline_at: deadline.toISOString(),
            answers: {}
          })
          .select()
          .single();

        if (createErr) throw createErr;
        attemptRecord = newAtt;
      }

      // Fetch questions — NEVER send correct_option or explanation to browser!
      const { data: questions, error: qErr } = await sb
        .from("exam_questions")
        .select("id, question_number, question_text, options")
        .eq("subject_id", subject.id)
        .order("question_number", { ascending: true });

      if (qErr) throw qErr;

      if (!questions || questions.length === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No questions currently loaded for this subject." }));
        return true;
      }

      // Pseudo-random deterministic shuffle of questions based on attempt ID
      // Keeps option order fixed as required!
      const seeded = questions
        .map((q, idx) => {
          // hash attempt ID + question id
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
          options: item.q.options // kept fixed order
        }));

      const deadlineMs = new Date(attemptRecord.deadline_at).getTime();
      const remainingSeconds = Math.max(0, Math.floor((deadlineMs - Date.now()) / 1000));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        attempt_id: attemptRecord.id,
        is_resume: isResume,
        subject: {
          id: subject.id,
          code: subject.code,
          title: subject.title,
          duration_minutes: subject.duration_minutes
        },
        started_at: attemptRecord.started_at,
        deadline_at: attemptRecord.deadline_at,
        remaining_seconds: remainingSeconds,
        saved_answers: attemptRecord.answers || {},
        questions: seeded
      }));
    } catch (err) {
      logger.error(`[ExamApi] /api/exam/start error: ${err.message}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to initiate exam attempt. Please try again." }));
    }
    return true;
  }

  // 3. POST /api/exam/submit
  if (req.method === "POST" && url.pathname === "/api/exam/submit") {
    try {
      const body = await readJsonBody(req);
      const { attempt_id, answers } = body;

      if (!attempt_id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "attempt_id is required." }));
        return true;
      }

      // Fetch attempt
      const { data: attempt, error: attErr } = await sb
        .from("exam_attempts")
        .select("*, exam_subjects(title, code, field)")
        .eq("id", attempt_id)
        .single();

      if (attErr || !attempt) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Exam attempt not found." }));
        return true;
      }

      if (attempt.submitted_at != null) {
        // Already submitted: return saved result
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          already_submitted: true,
          score: attempt.score,
          correct_count: attempt.correct_count,
          total: attempt.total,
          time_used_minutes: Math.max(1, Math.round((new Date(attempt.submitted_at) - new Date(attempt.started_at)) / 60000)),
          student_name: attempt.student_name,
          subject_title: attempt.exam_subjects?.title || "Exam"
        }));
        return true;
      }

      const now = Date.now();
      const deadline = new Date(attempt.deadline_at).getTime();

      // Grace period check (15 seconds)
      if (now > deadline + GRACE_PERIOD_MS) {
        logger.warn(`[ExamApi] Attempt ${attempt_id} submitted after grace period (${Math.round((now - deadline)/1000)}s late)`);
      }

      // Fetch official answer key server-side from exam_questions
      const { data: officialQuestions, error: qErr } = await sb
        .from("exam_questions")
        .select("id, question_number, question_text, options, correct_option, explanation")
        .eq("subject_id", attempt.subject_id)
        .order("question_number", { ascending: true });

      if (qErr) throw qErr;

      const total = officialQuestions?.length || 0;
      let correctCount = 0;
      const normalizedAnswers = typeof answers === "object" && answers !== null ? answers : {};

      const review = [];

      for (const q of (officialQuestions || [])) {
        const studentChoice = normalizedAnswers[q.id] || null;
        const isCorrect = studentChoice && studentChoice.trim().toUpperCase() === q.correct_option?.trim().toUpperCase();

        if (isCorrect) correctCount++;

        if (SHOW_REVIEW && q.explanation) {
          review.push({
            id: q.id,
            question_number: q.question_number,
            question_text: q.question_text,
            options: q.options,
            student_answer: studentChoice,
            correct_answer: q.correct_option,
            is_correct: isCorrect,
            explanation: q.explanation
          });
        }
      }

      // Score formula: (correct / total) * 20, rounded to 1 decimal place
      const rawScore = total > 0 ? (correctCount / total) * 20 : 0;
      const score = Math.round(rawScore * 10) / 10;
      const submittedAt = new Date().toISOString();
      const startedAt = new Date(attempt.started_at);
      const timeUsedMinutes = Math.max(1, Math.round((new Date(submittedAt) - startedAt) / 60000));

      // Save to exam_attempts
      const { error: updateErr } = await sb
        .from("exam_attempts")
        .update({
          submitted_at: submittedAt,
          answers: normalizedAnswers,
          correct_count: correctCount,
          total,
          score
        })
        .eq("id", attempt_id);

      if (updateErr) throw updateErr;

      // Send Telegram alert to ADMIN_CHAT_ID
      const subjectTitle = attempt.exam_subjects?.title || "Exam";
      const subjectField = attempt.field || "Science";
      const submissionTimeFormatted = new Date().toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" });

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
🕒 Submitted: ${submissionTimeFormatted}`;

        await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, adminMsg);
      } catch (tgErr) {
        logger.error(`[ExamApi] Telegram notification failed: ${tgErr.message}`);
        // Telegram failure does NOT break the student's submission response
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        student_name: attempt.student_name,
        subject_title: subjectTitle,
        score,
        correct_count: correctCount,
        total,
        time_used_minutes: timeUsedMinutes,
        review: SHOW_REVIEW ? review : null
      }));
    } catch (err) {
      logger.error(`[ExamApi] /api/exam/submit error: ${err.message}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to submit exam. Please try again." }));
    }
    return true;
  }

  return false; // Not handled by this sub-router
}

// ── Register Bot Admin Commands (/results <SUBJECT>) ──────────
export function registerExamBotHandlers(bot) {
  bot.command("results", async (ctx) => {
    // Only admin can view exam results
    const adminChatId = String(process.env.ADMIN_CHAT_ID);
    if (String(ctx.chat.id) !== adminChatId) {
      return ctx.reply("⛔ This command is restricted to platform administrators.");
    }

    const text = ctx.message.text || "";
    const arg = text.replace(/^\/results(@\w+)?\s*/i, "").trim();

    try {
      let query = sb
        .from("exam_attempts")
        .select(`
          id, student_name, student_id, phone, field, score, correct_count, total, started_at, submitted_at,
          exam_subjects!inner(title, code)
        `)
        .not("submitted_at", "is", null)
        .order("submitted_at", { ascending: false })
        .limit(20);

      if (arg) {
        query = query.or(`title.ilike.%${arg}%,code.ilike.%${arg}%`, { foreignTable: "exam_subjects" });
      }

      const { data: attempts, error } = await query;
      if (error) throw error;

      if (!attempts || attempts.length === 0) {
        return ctx.reply(
          `ℹ️ No exam results found${arg ? ` matching "${arg}"` : ""}.\n\nUsage: /results <subject>\nExample: /results Maths, /results Physics`
        );
      }

      const lines = [
        `📊 *Exam Results (Last ${attempts.length})*${arg ? ` [Filter: ${arg}]` : ""}:\n`
      ];

      attempts.forEach((att, idx) => {
        const timeMin = Math.max(1, Math.round((new Date(att.submitted_at) - new Date(att.started_at)) / 60000));
        const subTitle = att.exam_subjects?.title || "Exam";
        lines.push(
          `${idx + 1}. *${att.student_name}* (${att.student_id})\n` +
          `   📚 ${subTitle} (${att.field})\n` +
          `   ⭐ *${att.score} / 20* (${att.correct_count}/${att.total} correct) · ⏱ ${timeMin}m\n` +
          `   📞 \`${att.phone}\``
        );
      });

      await ctx.replyWithMarkdown(lines.join("\n\n"));
    } catch (err) {
      logger.error(`[ExamBot] /results error: ${err.message}`);
      await ctx.reply(`❌ Failed to retrieve results: ${err.message}`);
    }
  });
}

