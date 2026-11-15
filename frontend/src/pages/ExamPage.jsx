// src/pages/ExamPage.jsx — CSH Tutorial Mock Exam Portal
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { normalizeOrderCode } from "../lib/quizAccess";
import { supabase } from "../lib/supabase";
import "../exam.css";

// ── Configuration ─────────────────────────────────────────────
const BOT_API =
  import.meta.env.VITE_BOT_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.startsWith("172."))
    ? "http://localhost:3000"
    : "");

async function callExamApi(endpoint, options = {}) {
  const primaryUrl = BOT_API ? `${BOT_API}${endpoint}` : endpoint;
  try {
    const res = await fetch(primaryUrl, options);
    return res;
  } catch (err) {
    if (BOT_API) {
      try {
        const fallbackRes = await fetch(endpoint, options);
        return fallbackRes;
      } catch (_) {}
    }
    throw err;
  }
}

const STORAGE_KEY = "csh_active_exam_attempt";
const SESSION_CODE_KEY = "csh_exam_order_code";

// ── Validation Helpers ────────────────────────────────────────
function validateOrderCodeFormat(code) {
  const norm = normalizeOrderCode(code);
  return /^NT-[A-Z0-9]{6}$/.test(norm);
}

function validateEthiopianPhone(phone) {
  const cleaned = (phone || "").replace(/[\s\-]/g, "");
  return /^(09|07)\d{8}$/.test(cleaned) || /^\+251(9|7)\d{8}$/.test(cleaned);
}

function validateStudentId(id) {
  const cleaned = (id || "").trim();
  return /^[A-Za-z0-9/\-]{3,20}$/.test(cleaned);
}

function formatTime(seconds) {
  if (seconds <= 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDurationText(minutes) {
  if (!minutes) return "1 hour";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) {
    return `${h} hour${h > 1 ? "s" : ""} ${m} minute${m > 1 ? "s" : ""}`;
  }
  if (h > 0) {
    return `${h} hour${h > 1 ? "s" : ""}`;
  }
  return `${m} minute${m > 1 ? "s" : ""}`;
}

export default function ExamPage() {
  const location = useLocation();

  // ── Entry State ─────────────────────────────────────────────
  const [step, setStep] = useState("entry"); // entry | exam | submitting | result | error
  const [orderCodeInput, setOrderCodeInput] = useState("");
  const [verifiedOrder, setVerifiedOrder] = useState(null); // { name, field, code }
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Student-provided inputs
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentIdTouched, setStudentIdTouched] = useState(false);

  // Subject state
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  // ── Exam Engine State ───────────────────────────────────────
  const [attemptId, setAttemptId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Modal & Results State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync answersRef
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ── 1. Initialize from URL, Session, or Active Attempt ───────
  useEffect(() => {
    // A) Check for ongoing active attempt (refresh resilience)
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.attempt_id && parsed.deadline_at) {
          const remaining = Math.floor((new Date(parsed.deadline_at).getTime() - Date.now()) / 1000);
          if (remaining > 0) {
            setAttemptId(parsed.attempt_id);
            setOrderCodeInput(parsed.code || "");
            setVerifiedOrder({
              name: parsed.student_name,
              field: parsed.field,
              code: parsed.code,
            });
            setQuestions(parsed.questions || []);
            setAnswers(parsed.answers || {});
            answersRef.current = parsed.answers || {};
            setTimeLeft(remaining);
            setStep("exam");
            return;
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (_) {
      localStorage.removeItem(STORAGE_KEY);
    }

    // B) Check URL query parameters (?order=NT-XXXXXX or ?order_code=...)
    const params = new URLSearchParams(location.search);
    const urlCode = params.get("order") || params.get("order_code") || "";
    const sessionCode = sessionStorage.getItem(SESSION_CODE_KEY) || "";

    const codeToVerify = urlCode || sessionCode;
    if (codeToVerify) {
      const norm = normalizeOrderCode(codeToVerify);
      setOrderCodeInput(norm);
      verifyOrderCode(norm);
    }
  }, [location.search]); // eslint-disable-line

  // ── 2. Warn User Before Leaving / Reloading Active Exam ──────
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (step === "exam") {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave? Your exam is in progress.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step]);

  // ── 3. Total Countdown Timer ────────────────────────────────
  useEffect(() => {
    if (step !== "exam") return;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [step]); // eslint-disable-line

  // ── 4. Verify Order Code & Fetch Available Subjects ─────────
  async function verifyOrderCode(codeToTest) {
    const code = normalizeOrderCode(codeToTest || orderCodeInput);
    setOrderError("");

    if (!code) {
      setOrderError("Please enter your order code (e.g. NT-8K3P9Q).");
      return;
    }

    if (!validateOrderCodeFormat(code)) {
      setOrderError("Invalid code format. Expected NT-XXXXXX (e.g. NT-8K3P9Q).");
      return;
    }

    setIsVerifyingCode(true);
    setSubjectsLoading(true);

    try {
      let verifiedData = null;

      // 1. First try backend API endpoint
      try {
        const res = await callExamApi(
          `/api/exam/subjects?code=${encodeURIComponent(code)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.valid) {
            verifiedData = data;
          } else if (data && data.valid === false) {
            setOrderError(data.message || "Invalid or unapproved order code.");
            setVerifiedOrder(null);
            setSubjects([]);
            return;
          }
        }
      } catch (_) {
        // Fall back to direct Supabase verification below
      }

      // 2. Direct Supabase verification (resilient fallback for edge / server sleep)
      if (!verifiedData) {
        const { data: order, error: orderErr } = await supabase
          .from("orders")
          .select("order_code, name, department, status")
          .eq("order_code", code)
          .maybeSingle();

        if (orderErr) {
          console.warn("[Exam] Direct orders query note:", orderErr.message);
          throw orderErr;
        }

        if (!order || order.status !== "approved") {
          setOrderError("Invalid or unapproved order code.");
          setVerifiedOrder(null);
          setSubjects([]);
          return;
        }

        const orderField = order.department || "Natural";

        // Fetch subjects matching student field (or shared 'Both')
        const { data: subList, error: subErr } = await supabase
          .from("exam_subjects")
          .select("id, code, title, field, duration_minutes, question_count, is_active")
          .or(`field.eq.${orderField},field.eq.Both`)
          .order("created_at", { ascending: true });

        if (subErr) throw subErr;

        // Check taken attempts
        const { data: attempts } = await supabase
          .from("exam_attempts")
          .select("subject_id, submitted_at")
          .eq("order_code", code);

        const takenSubjectIds = new Set(
          (attempts || []).filter((a) => a.submitted_at != null).map((a) => a.subject_id)
        );

        const mappedSubjects = (subList || []).map((sub) => {
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

        verifiedData = {
          valid: true,
          name: order.name,
          field: orderField,
          subjects: mappedSubjects,
        };
      }

      // Success: order approved!
      const orderData = {
        name: verifiedData.name,
        field: verifiedData.field || "Natural",
        code,
      };
      setVerifiedOrder(orderData);
      sessionStorage.setItem(SESSION_CODE_KEY, code);

      const subList = verifiedData.subjects || [];
      setSubjects(subList);

      // Auto-select first available subject if current selection is invalid
      const firstAvailable = subList.find((s) => s.status === "available");
      if (firstAvailable) {
        setSelectedSubjectId(firstAvailable.id);
      } else {
        setSelectedSubjectId("");
      }
    } catch (err) {
      console.error("[Exam] Verification error:", err);
      setOrderError("Something went wrong. Please try again.");
    } finally {
      setIsVerifyingCode(false);
      setSubjectsLoading(false);
    }
  }

  function handleResetOrderCode() {
    sessionStorage.removeItem(SESSION_CODE_KEY);
    setVerifiedOrder(null);
    setOrderCodeInput("");
    setOrderError("");
    setSubjects([]);
    setSelectedSubjectId("");
  }

  // ── 5. Start Exam ───────────────────────────────────────────
  async function handleStartExam() {
    setPhoneTouched(true);
    setStudentIdTouched(true);

    if (!verifiedOrder) {
      setOrderError("Please verify your order code first.");
      return;
    }

    if (!validateEthiopianPhone(phone)) return;
    if (!validateStudentId(studentId)) return;

    const chosen = subjects.find((s) => s.id === selectedSubjectId);
    if (!chosen || chosen.status !== "available") {
      setOrderError("Please select an available subject.");
      return;
    }

    setStep("submitting");
    setErrorMsg("");

    try {
      const payload = {
        code: verifiedOrder.code,
        phone: phone.trim(),
        student_id: studentId.trim().toUpperCase(),
        subject_id: chosen.id,
      };

      const res = await callExamApi("/api/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (_) {
        if (!res.ok) {
          throw new Error("Unable to connect to exam server. Please ensure the backend server is active.");
        }
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to start exam.");
      }

      setAttemptId(data.attempt_id);
      setQuestions(data.questions || []);
      setCurrentIdx(0);
      const initialAnswers = data.saved_answers || {};
      setAnswers(initialAnswers);
      answersRef.current = initialAnswers;
      setTimeLeft(data.remaining_seconds || (chosen.duration_minutes || 60) * 60);

      // Save to localStorage for refresh recovery
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          attempt_id: data.attempt_id,
          deadline_at: data.deadline_at,
          code: verifiedOrder.code,
          student_name: verifiedOrder.name,
          field: verifiedOrder.field,
          phone,
          student_id: studentId,
          questions: data.questions,
          answers: initialAnswers,
        })
      );

      setStep("exam");
    } catch (err) {
      setErrorMsg(err.message || "Failed to start exam. Please try again.");
      setStep("error");
    }
  }

  // ── 6. Select Option ────────────────────────────────────────
  function handleSelectOption(optionId) {
    const q = questions[currentIdx];
    if (!q) return;

    setAnswers((prev) => {
      const updated = { ...prev, [q.id]: optionId };
      answersRef.current = updated;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.answers = updated;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch (_) {}

      return updated;
    });
  }

  // ── 7. Submit Answers ───────────────────────────────────────
  const submitExamToServer = useCallback(async () => {
    clearInterval(timerRef.current);
    setShowConfirmModal(false);
    setStep("submitting");

    try {
      const payload = {
        code: verifiedOrder?.code || orderCodeInput,
        attempt_id: attemptId,
        answers: answersRef.current,
      };

      const res = await callExamApi("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (_) {
        if (!res.ok) {
          throw new Error("Unable to connect to exam server. Please try submitting again.");
        }
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit exam.");
      }

      localStorage.removeItem(STORAGE_KEY);
      setResult(data);
      setStep("result");
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit exam.");
      setStep("error");
    }
  }, [attemptId, verifiedOrder, orderCodeInput]);

  function handleAutoSubmit() {
    submitExamToServer();
  }

  // ── Calculations ────────────────────────────────────────────
  const isPhoneValid = validateEthiopianPhone(phone);
  const isStudentIdValid = validateStudentId(studentId);
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const isStartDisabled =
    !verifiedOrder ||
    !isPhoneValid ||
    !isStudentIdValid ||
    !selectedSubject ||
    selectedSubject.status !== "available" ||
    isVerifyingCode;

  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isTimerDanger = timeLeft <= 300; // last 5 minutes

  return (
    <>
      <Navbar />
      <main className="exam-page">
        <div className="exam-shell">

          {/* ── STEP 1: VERIFICATION & REGISTRATION ─────────── */}
          {step === "entry" && (
            <div className="exam-card">
              <div className="exam-card__icon">📝</div>
              <h1 className="exam-card__title">CSH Mock Exam Portal</h1>
              <p className="exam-card__subtitle">
                Enter your subscription Order Code, Phone Number, and Student ID to begin.
              </p>

              {/* 1. Order Code Section */}
              <div className="exam-field" style={{ marginBottom: "1.25rem" }}>
                <label className="exam-label" htmlFor="order_code">
                  Subscription Order Code *
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    id="order_code"
                    className={`exam-input${orderError ? " exam-input--error" : ""}`}
                    type="text"
                    placeholder="e.g. NT-8K3P9Q"
                    value={orderCodeInput}
                    disabled={!!verifiedOrder || isVerifyingCode}
                    onChange={(e) => {
                      setOrderCodeInput(normalizeOrderCode(e.target.value));
                      setOrderError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !verifiedOrder) {
                        e.preventDefault();
                        verifyOrderCode();
                      }
                    }}
                    autoComplete="off"
                  />
                  {!verifiedOrder ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ minWidth: "110px", flexShrink: 0 }}
                      onClick={() => verifyOrderCode()}
                      disabled={isVerifyingCode || !orderCodeInput.trim()}
                    >
                      {isVerifyingCode ? "Checking…" : "Verify"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ minWidth: "110px", flexShrink: 0 }}
                      onClick={handleResetOrderCode}
                    >
                      Change Code
                    </button>
                  )}
                </div>
                {orderError && <span className="exam-error-msg">{orderError}</span>}
              </div>

              {/* 2. Read-Only Order Information (Filled from Order) */}
              {verifiedOrder && (
                <div className="exam-readonly-box" style={{ animation: "examFadeIn 0.25s ease" }}>
                  <div>
                    <span className="exam-readonly-label">Student Name (from order)</span>
                    <span className="exam-readonly-val">👤 {verifiedOrder.name}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="exam-readonly-label">Field (from order)</span>
                    <span className="badge" style={{ fontSize: "0.85rem", fontWeight: "700" }}>
                      {verifiedOrder.field === "Natural" ? "🔬 Natural Science" : "📚 Social Science"}
                    </span>
                  </div>
                </div>
              )}

              {/* 3. Phone & Student ID (Required) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)", marginTop: "1rem" }}>
                <div className="exam-field">
                  <label className="exam-label" htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    className={`exam-input${phoneTouched && !isPhoneValid ? " exam-input--error" : ""}`}
                    type="tel"
                    placeholder="09XXXXXXXX or 07XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => setPhoneTouched(true)}
                  />
                  {phoneTouched && !isPhoneValid && (
                    <span className="exam-error-msg">
                      Enter a valid Ethiopian number (09... / 07... / +251...)
                    </span>
                  )}
                </div>

                <div className="exam-field">
                  <label className="exam-label" htmlFor="student_id">Student ID *</label>
                  <input
                    id="student_id"
                    className={`exam-input${studentIdTouched && !isStudentIdValid ? " exam-input--error" : ""}`}
                    type="text"
                    placeholder="e.g. RUXXXX/19 or UGR/..."
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                    onBlur={() => setStudentIdTouched(true)}
                  />
                  {studentIdTouched && !isStudentIdValid && (
                    <span className="exam-error-msg">
                      Enter valid Student ID (3-20 characters)
                    </span>
                  )}
                </div>
              </div>

              {/* 4. Subject Cards for Student's Field */}
              {verifiedOrder && (
                <div style={{ marginTop: "1.75rem" }}>
                  <div className="exam-section-label">
                    Choose Subject ({verifiedOrder.field} Science)
                  </div>

                  {subjectsLoading ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                      Loading subjects…
                    </div>
                  ) : subjects.length === 0 ? (
                    <div className="exam-info-box" style={{ background: "var(--accent-light)", color: "var(--accent-dark)" }}>
                      <span>⚠️</span>
                      <span>No exam is open right now. Please wait for the admin's announcement.</span>
                    </div>
                  ) : (
                    <div className="exam-subject-grid">
                      {subjects.map((sub) => {
                        const isSelected = selectedSubjectId === sub.id;
                        const isAvailable = sub.status === "available";

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            className={`exam-subject-btn${isSelected ? " active" : ""}${!isAvailable ? " disabled" : ""}`}
                            onClick={() => {
                              if (isAvailable) setSelectedSubjectId(sub.id);
                            }}
                            disabled={!isAvailable}
                          >
                            <span className="exam-subject-icon">
                              {sub.code.startsWith("MATH") ? "📐" :
                               sub.code.startsWith("PHYS") ? "⚡" :
                               sub.code.startsWith("LOGIC") || sub.code.startsWith("PHIL") ? "💡" :
                               sub.code.startsWith("PSYC") ? "🧠" :
                               sub.code.startsWith("GEOG") ? "🌍" : "📊"}
                            </span>
                            <span className="exam-subject-name">{sub.title}</span>
                            <div className="exam-subject-meta">
                              <span>📝 {sub.question_count || 20} Qs</span>
                              <span>•</span>
                              <span>⏱ {formatDurationText(sub.duration_minutes)}</span>
                            </div>

                            <span className={`exam-status-badge ${sub.status}`}>
                              {sub.status === "available" ? "● Available" :
                               sub.status === "taken" ? "✓ Already taken" : "✕ Closed"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Start Exam Action */}
              <div style={{ marginTop: "2rem" }}>
                <button
                  type="button"
                  className="btn btn-primary exam-submit-btn"
                  disabled={isStartDisabled}
                  onClick={handleStartExam}
                >
                  🚀 Start Exam
                </button>
                {isStartDisabled && verifiedOrder && (
                  <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                    {!isPhoneValid || !isStudentIdValid
                      ? "Please enter a valid phone number and Student ID."
                      : !selectedSubject || selectedSubject.status !== "available"
                      ? "Please select an available subject card."
                      : ""}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2: ACTIVE EXAM ENGINE ──────────────────── */}
          {step === "exam" && currentQ && (
            <div className="exam-card">
              {/* Top Navigation & Countdown Timer */}
              <div className="exam-topbar">
                <div className="exam-topbar-info">
                  <span className="exam-subject-badge">
                    {selectedSubject?.title || "Exam"} · {verifiedOrder?.field} Science
                  </span>
                  <span className="exam-student-tag">
                    {verifiedOrder?.name} ({studentId}) · {verifiedOrder?.code}
                  </span>
                </div>

                <div className={`exam-timer-box${isTimerDanger ? " danger" : timeLeft <= 600 ? " warning" : ""}`}>
                  <span>⏱</span>
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Question Palette */}
              <div className="exam-palette-container">
                <div className="exam-palette-header">
                  <span>Question Palette</span>
                  <div className="exam-palette-legend">
                    <span><i className="palette-dot cur" /> Current</span>
                    <span><i className="palette-dot ans" /> Answered</span>
                    <span><i className="palette-dot unans" /> Unanswered</span>
                  </div>
                </div>
                <div className="exam-palette-grid">
                  {questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isCurrent = idx === currentIdx;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        className={`exam-palette-num${isCurrent ? " current" : isAnswered ? " answered" : ""}`}
                        onClick={() => setCurrentIdx(idx)}
                        title={`Question ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Question */}
              <div className="exam-question-box">
                <span className="exam-question-badge">
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
                <div className="exam-question-text">{currentQ.question_text}</div>

                <div className="exam-options">
                  {(currentQ.options || []).map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`exam-option${isSelected ? " selected" : ""}`}
                        onClick={() => handleSelectOption(opt.id)}
                      >
                        <span className="exam-option-id">{opt.id}</span>
                        <span className="exam-option-text">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Navigation */}
              <div className="exam-nav-bar">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                >
                  ← Previous
                </button>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {currentIdx < totalQuestions - 1 && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setCurrentIdx((p) => Math.min(totalQuestions - 1, p + 1))}
                    >
                      Next Question →
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ background: "var(--success)", borderColor: "var(--success)" }}
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Submit Exam 🏁
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── CONFIRM SUBMIT MODAL ────────────────────────── */}
          {showConfirmModal && (
            <div className="exam-modal-overlay">
              <div className="exam-modal">
                <div className="exam-modal-icon">⚠️</div>
                <h3 className="exam-modal-title">Submit Examination?</h3>
                <p className="exam-modal-body">
                  You answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions.
                  {totalQuestions - answeredCount > 0 && (
                    <div className="exam-modal-warn">
                      Notice: You have {totalQuestions - answeredCount} unanswered questions that will be marked as incorrect.
                    </div>
                  )}
                </p>
                <div className="exam-modal-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Return to Questions
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={submitExamToServer}
                  >
                    Yes, Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: SUBMITTING / LOADING ────────────────── */}
          {step === "submitting" && (
            <div className="exam-card exam-card--center">
              <div className="exam-spinner" aria-label="Loading..." />
              <p className="exam-loading-text">
                {questions.length === 0 ? "Preparing your exam questions…" : "Grading your submission & recording results…"}
              </p>
            </div>
          )}

          {/* ── STEP 4: RESULT SCREEN ───────────────────────── */}
          {step === "result" && result && (
            <div className="exam-card exam-card--result">
              <div className="exam-result-emoji">
                {result.score >= 16 ? "🏆" : result.score >= 14 ? "🎉" : result.score >= 10 ? "👍" : "📚"}
              </div>
              <h2 className="exam-card__title">Exam Completed!</h2>
              <p className="exam-result-meta">
                Student: <strong>{result.student_name}</strong> · Subject: <strong>{result.subject_title}</strong> · Time used: <strong>{result.time_used_minutes} min</strong>
              </p>

              <div className={`exam-score-display ${result.score >= 14 ? "pass" : "below"}`}>
                <span className="exam-score-num">{result.score?.toFixed(1)}</span>
                <span className="exam-score-denom">/ 20</span>
              </div>

              <p className="exam-result-detail">
                You correctly answered <strong>{result.correct_count}</strong> out of <strong>{result.total}</strong> questions.
              </p>

              {result.score >= 14 ? (
                <div className="exam-result-congrats">
                  🌟 Congratulations! You have successfully passed this subject exam.
                </div>
              ) : (
                <div className="exam-result-encourage">
                  💪 Keep practicing to strengthen your concepts.
                </div>
              )}

              <div className="exam-action-row exam-action-row--center" style={{ marginTop: "2rem" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setResult(null);
                    setStep("entry");
                    if (verifiedOrder) {
                      verifyOrderCode(verifiedOrder.code);
                    }
                  }}
                >
                  Take Another Subject
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 5: ERROR SCREEN ────────────────────────── */}
          {step === "error" && (
            <div className="exam-card exam-card--center">
              <div className="exam-error-icon">⚠️</div>
              <h2 className="exam-card__title">Notice</h2>
              <p className="exam-error-body">{errorMsg || "Something went wrong. Please try again."}</p>

              <div className="exam-action-row exam-action-row--center">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setErrorMsg("");
                    setStep("entry");
                    if (verifiedOrder) {
                      verifyOrderCode(verifiedOrder.code);
                    }
                  }}
                >
                  ← Back to Selection
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setErrorMsg("");
                    handleResetOrderCode();
                    setStep("entry");
                  }}
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
