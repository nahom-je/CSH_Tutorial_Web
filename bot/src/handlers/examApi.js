// src/handlers/examApi.js — Mock Exam API & Telegram Admin Handlers
import { createClient } from "@supabase/supabase-js";
import { getOrderByCode } from "../db/database.js";
import { normalizeOrderCode } from "../utils/token.js";
import { logger } from "../utils/logger.js";

// ── Configuration ─────────────────────────────────────────────
export const SHOW_REVIEW = process.env.SHOW_REVIEW !== "false"; // default true
const GRACE_PERIOD_MS = 15000; // 15 seconds network grace period

// Allowed CORS Origins (Security rule: restricted to production web and local dev)
const ALLOWED_ORIGINS = [
  "https://csh-tutorial-web.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

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

setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.startTime > 60 * 1000) rateLimitMap.delete(ip);
  }
}, 10 * 60 * 1000);

// ── Validation Helpers ────────────────────────────────────────
export function normalizePhone(phone) {
  if (!phone) return "";
  let p = phone.replace(/[\s\-]/g, "");
  if (p.startsWith("+251")) return p;
  if (p.startsWith("251")) return "+" + p;
  if (p.startsWith("0")) return "+251" + p.slice(1);
  return p;
}

export function isValidEthiopianPhone(phone) {
  const cleaned = (phone || "").replace(/[\s\-]/g, "");
  return /^(09|07)\d{8}$/.test(cleaned) || /^\+251(9|7)\d{8}$/.test(cleaned);
}

export function isValidStudentId(id) {
  const cleaned = (id || "").trim();
  return /^[A-Za-z0-9/\-]{3,20}$/.test(cleaned);
}

export function isValidOrderCodeFormat(code) {
  const norm = normalizeOrderCode(code);
  return /^NT-[A-Z0-9]{6}$/.test(norm);
}

// ── Helper: Order Access Verification (No Device Lock for Exam) ──
async function verifyExamOrder(rawCode) {
  const normalized = normalizeOrderCode(rawCode);
  if (!isValidOrderCodeFormat(normalized)) {
    return { valid: false, error: "Invalid or unapproved order code.", status: 400 };
  }

  let order;
  try {
    order = await getOrderByCode(normalized);
  } catch (err) {
    logger.error(`[ExamApi] getOrderByCode error: ${err.message}`);
    return { valid: false, error: "Database verification error.", status: 500 };
  }

  if (!order || order.status !== "approved") {
    return { valid: false, error: "Invalid or unapproved order code.", status: 403 };
  }

  return { valid: true, order, normalizedCode: normalized };
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
  // CORS configuration (allow only verified origins)
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Non-browser or local direct request
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }

  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  if (isRateLimited(clientIp)) {
    res.writeHead(429, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Too many requests. Please slow down." }));
    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // 1. GET /api/exam/subjects?code=NT-XXXXXX
  // ─────────────────────────────────────────────────────────────
  if (req.method === "GET" && url.pathname === "/api/exam/subjects") {
    try {
      const code = url.searchParams.get("code") || "";

      const auth = await verifyExamOrder(code);
      if (!auth.valid) {
        res.writeHead(auth.status, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            valid: false,
            message: auth.error,
          })
        );
        return true;
      }

      const { order, normalizedCode } = auth;
      const orderField = order.department || "Natural"; // 'Natural' or 'Social'

      // Fetch subjects matching student's field (or shared 'Both')
      const { data: subjects, error: subErr } = await sb
        .from("exam_subjects")
        .select("id, code, title, field, duration_minutes, question_count, is_active")
        .or(`field.eq.${orderField},field.eq.Both`)
        .order("created_at", { ascending: true });

      if (subErr) throw subErr;

      // Check existing attempts for this order_code to flag already taken subjects
      let attempts = [];
      try {
        const { data: attData, error: attErr } = await sb
          .from("exam_attempts")
          .select("subject_id, submitted_at")
          .eq("order_code", normalizedCode);
        if (!attErr && attData) {
          attempts = attData;
        } else if (attErr) {
          logger.warn(`[ExamApi] attempts query note: ${attErr.message}`);
        }
      } catch (err) {
        logger.warn(`[ExamApi] attempts query fallback: ${err.message}`);
      }

      const takenSubjectIds = new Set(
        (attempts || [])
          .filter((a) => a.submitted_at != null)
          .map((a) => a.subject_id)
      );

      // Map subjects with status: 'available' | 'taken' | 'closed'
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
          status, // 'available' | 'taken' | 'closed'
        };
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          valid: true,
          name: order.name,
          field: orderField,
          subjects: mappedSubjects,
        })
      );
    } catch (err) {
      logger.error(`[ExamApi] /api/exam/subjects error: ${err.message}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Something went wrong. Please try again." }));
    }
    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // 2. POST /api/exam/start
  // ─────────────────────────────────────────────────────────────
  if (req.method === "POST" && url.pathname === "/api/exam/start") {
    try {
      const body = await readJsonBody(req);
      const { code, phone, student_id, subject_id } = body;

      // 1. Verify Order
      const auth = await verifyExamOrder(code);
      if (!auth.valid) {
        res.writeHead(auth.status, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: auth.error,
          })
        );
        return true;
      }

      const { order, normalizedCode } = auth;
      const orderField = order.department || "Natural";

      // 2. Validate student-typed inputs
      if (!isValidEthiopianPhone(phone)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Please enter a valid Ethiopian phone number (e.g. 09XXXXXXXX, 07XXXXXXXX, or +251...).",
          })
        );
        return true;
      }

      if (!isValidStudentId(student_id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Please enter a valid Student ID (3 to 20 characters).",
          })
        );
        return true;
      }

      if (!subject_id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Please select an exam subject." }));
        return true;
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
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Subject not found." }));
        return true;
      }

      if (subject.is_active === false) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "This exam is currently closed. Please wait for the admin's announcement.",
          })
        );
        return true;
      }

      if (subject.field !== "Both" && subject.field !== orderField) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: `Subject ${subject.title} is not available for ${orderField} Science.`,
          })
        );
        return true;
      }

      // 4. Check Attempts for this (order_code, subject_id)
      let existingAttempts = [];
      try {
        const { data: attData, error: attErr } = await sb
          .from("exam_attempts")
          .select("id, started_at, deadline_at, submitted_at, answers")
          .eq("order_code", normalizedCode)
          .eq("subject_id", subject.id)
          .order("started_at", { ascending: false });

        if (!attErr && attData) {
          existingAttempts = attData;
        } else if (attErr) {
          logger.warn(`[ExamApi] existingAttempts query note: ${attErr.message}`);
        }
      } catch (err) {
        logger.warn(`[ExamApi] existingAttempts query fallback: ${err.message}`);
      }

      const now = new Date();
      const finished = existingAttempts?.find((a) => a.submitted_at != null);

      if (finished) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: `You have already taken the exam for ${subject.title}. Only 1 attempt is allowed.`,
            already_taken: true,
          })
        );
        return true;
      }

      // 5. Active in-progress attempt (Resume seamlessly with the same deadline!)
      const activeAttempt = existingAttempts?.find(
        (a) => a.submitted_at == null && new Date(a.deadline_at).getTime() > now.getTime()
      );

      let attemptRecord;
      let isResume = false;

      if (activeAttempt) {
        attemptRecord = activeAttempt;
        isResume = true;
        // Keep phone and student_id updated
        await sb
          .from("exam_attempts")
          .update({ phone: normalizedPhone, student_id: cleanStudentId })
          .eq("id", activeAttempt.id);
      } else {
        // Create new attempt
        const durationMinutes = subject.duration_minutes || 60;
        const deadline = new Date(now.getTime() + durationMinutes * 60 * 1000);

        const attemptInsertData = {
          order_code: normalizedCode,
          student_name: order.name, // from order
          field: orderField,        // from order
          phone: normalizedPhone,   // student-typed
          student_id: cleanStudentId, // student-typed
          subject_id: subject.id,
          started_at: now.toISOString(),
          deadline_at: deadline.toISOString(),
          answers: {},
        };

        let { data: newAtt, error: createErr } = await sb
          .from("exam_attempts")
          .insert(attemptInsertData)
          .select()
          .single();

        if (createErr && createErr.message?.includes("order_code")) {
          // If order_code column hasn't been added yet, insert without it
          delete attemptInsertData.order_code;
          const retry = await sb
            .from("exam_attempts")
            .insert(attemptInsertData)
            .select()
            .single();
          newAtt = retry.data;
          createErr = retry.error;
        }

        if (createErr) throw createErr;
        attemptRecord = newAtt;
      }

      // 6. Fetch questions — NEVER send correct_option or explanation to client!
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

      // Deterministic question shuffle based on attempt ID, preserving fixed option order
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
          options: item.q.options, // fixed options order
        }));

      const deadlineMs = new Date(attemptRecord.deadline_at).getTime();
      const remainingSeconds = Math.max(0, Math.floor((deadlineMs - Date.now()) / 1000));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
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
        })
      );
    } catch (err) {
      logger.error(`[ExamApi] /api/exam/start error: ${err.message}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to begin exam. Please try again." }));
    }
    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // 3. POST /api/exam/submit
  // ─────────────────────────────────────────────────────────────
  if (req.method === "POST" && url.pathname === "/api/exam/submit") {
    try {
      const body = await readJsonBody(req);
      const { code, attempt_id, answers } = body;

      // 1. Verify Order
      const auth = await verifyExamOrder(code);
      if (!auth.valid) {
        res.writeHead(auth.status, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: auth.error,
          })
        );
        return true;
      }

      if (!attempt_id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "attempt_id is required." }));
        return true;
      }

      // 2. Fetch attempt
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

      if (attempt.order_code && attempt.order_code !== auth.normalizedCode) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Attempt does not match this order code." }));
        return true;
      }

      // If already submitted, return saved result
      if (attempt.submitted_at != null) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            already_submitted: true,
            score: attempt.score,
            correct_count: attempt.correct_count,
            total: attempt.total,
            time_used_minutes: Math.max(
              1,
              Math.round(
                (new Date(attempt.submitted_at) - new Date(attempt.started_at)) / 60000
              )
            ),
            student_name: attempt.student_name,
            subject_title: attempt.exam_subjects?.title || "Exam",
          })
        );
        return true;
      }

      const now = Date.now();
      const deadline = new Date(attempt.deadline_at).getTime();

      // Grace period check
      if (now > deadline + GRACE_PERIOD_MS) {
        logger.warn(
          `[ExamApi] Attempt ${attempt_id} submitted after deadline grace period (${Math.round((now - deadline) / 1000)}s late)`
        );
      }

      // 3. Fetch questions and grade on server
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

      for (const q of officialQuestions || []) {
        const studentChoice = normalizedAnswers[q.id] || null;
        const isCorrect =
          studentChoice &&
          studentChoice.trim().toUpperCase() === q.correct_option?.trim().toUpperCase();

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
            explanation: q.explanation,
          });
        }
      }

      // Score = (correct / total) * 20, rounded to 1 decimal
      const rawScore = total > 0 ? (correctCount / total) * 20 : 0;
      const score = Math.round(rawScore * 10) / 10;
      const submittedAt = new Date().toISOString();
      const startedAt = new Date(attempt.started_at);
      const timeUsedMinutes = Math.max(1, Math.round((new Date(submittedAt) - startedAt) / 60000));

      // 4. Update attempt record
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

      // 5. Send Telegram alert to admin
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
🔑 Order: ${attempt.order_code || auth.normalizedCode}`;

        await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, adminMsg);
      } catch (tgErr) {
        logger.error(`[ExamApi] Telegram notification failed: ${tgErr.message}`);
        // Telegram failure does not break the student response
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          student_name: attempt.student_name,
          subject_title: subjectTitle,
          score,
          correct_count: correctCount,
          total,
          time_used_minutes: timeUsedMinutes,
          review: SHOW_REVIEW ? review : null,
        })
      );
    } catch (err) {
      logger.error(`[ExamApi] /api/exam/submit error: ${err.message}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to submit exam. Please try again." }));
    }
    return true;
  }

  return false;
}

// ── Register Bot Admin Commands (/results <SUBJECT>) ──────────
export function registerExamBotHandlers(bot) {
  bot.command("results", async (ctx) => {
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
          id, order_code, student_name, student_id, phone, field, score, correct_count, total, started_at, submitted_at,
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
          `   🔑 \`${att.order_code || "N/A"}\` · 📞 \`${att.phone}\``
        );
      });

      await ctx.replyWithMarkdown(lines.join("\n\n"));
    } catch (err) {
      logger.error(`[ExamBot] /results error: ${err.message}`);
      await ctx.reply(`❌ Failed to retrieve results: ${err.message}`);
    }
  });
}
