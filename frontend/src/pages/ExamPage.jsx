// src/pages/ExamPage.jsx — CSH Tutorial Mock Exam Portal
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../exam.css";

// ── API Endpoint ──────────────────────────────────────────────
const BOT_API =
  import.meta.env.VITE_BOT_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://csh-tutorial-bot.onrender.com");

const STORAGE_KEY = "csh_active_exam_attempt";

// ── Fallback Subjects Configuration ───────────────────────────
const DEFAULT_SUBJECTS = [
  {
    id: "sub-math",
    code: "MATH-1011",
    title: "Mathematics",
    field: "Both",
    duration_minutes: 90,
    question_count: 24,
    icon: "📐",
    time_label: "1h 30m"
  },
  {
    id: "sub-phys",
    code: "PHYS-1011",
    title: "General Physics",
    field: "Natural",
    duration_minutes: 60,
    question_count: 19,
    icon: "⚡",
    time_label: "1 hour"
  },
  {
    id: "sub-logic",
    code: "PHIL-1011",
    title: "Logic and Critical Thinking",
    field: "Both",
    duration_minutes: 40,
    question_count: 25,
    icon: "💡",
    time_label: "40 min"
  },
  {
    id: "sub-psyc",
    code: "PSYC-1011",
    title: "General Psychology",
    field: "Both",
    duration_minutes: 30,
    question_count: 33,
    icon: "🧠",
    time_label: "30 min"
  },
  {
    id: "sub-geog",
    code: "GEOG-1011",
    title: "Geography",
    field: "Both",
    duration_minutes: 40,
    question_count: 30,
    icon: "🌍",
    time_label: "40 min"
  },
  {
    id: "sub-econ",
    code: "ECON-1011",
    title: "General Economics",
    field: "Social",
    duration_minutes: 40,
    question_count: 20,
    icon: "📊",
    time_label: "40 min"
  }
];

function validateEthiopianPhone(phone) {
  const cleaned = (phone || "").replace(/\s+/g, "");
  return /^(09|07)\d{8}$/.test(cleaned) || /^\+251(9|7)\d{8}$/.test(cleaned);
}

function validateStudentId(id) {
  const cleaned = (id || "").trim();
  // Format: RU/XXXX/XX (case-insensitive, e.g. RU/1234/17)
  return /^RU\/[A-Z0-9]{3,6}\/\d{2}$/i.test(cleaned);
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

export default function ExamPage() {
  const [step, setStep] = useState("register"); // register | select | exam | submitting | result | error
  const [student, setStudent] = useState({ full_name: "", student_id: "", phone: "" });
  const [formErrors, setFormErrors] = useState({});
  const [field, setField] = useState("Natural"); // 'Natural' | 'Social'
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  
  // Exam Engine State
  const [attemptId, setAttemptId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  
  // Submit Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Result & Review State
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Keep answersRef synced
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ── 1. Fetch Subjects from Backend on Load ──────────────────
  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await fetch(`${BOT_API}/api/exam/subjects`);
        if (res.ok) {
          const data = await res.json();
          if (data.subjects && data.subjects.length > 0) {
            // merge with UI icons & labels
            const mapped = data.subjects.map((s) => {
              const def = DEFAULT_SUBJECTS.find((d) => d.code === s.code) || {};
              return {
                ...s,
                icon: def.icon || "📚",
                time_label: def.time_label || `${s.duration_minutes} min`
              };
            });
            setSubjects(mapped);
          }
        }
      } catch (_) {
        // Fallback to DEFAULT_SUBJECTS
      }
    }
    loadSubjects();
  }, []);

  // Filter subjects by chosen field
  const filteredSubjects = subjects.filter((s) => s.field === "Both" || s.field === field);

  // Keep selection valid when field changes
  useEffect(() => {
    if (!filteredSubjects.some((s) => s.id === selectedSubjectId || s.code === selectedSubjectId)) {
      setSelectedSubjectId(filteredSubjects[0]?.id || filteredSubjects[0]?.code || "");
    }
  }, [field, filteredSubjects]); // eslint-disable-line

  // ── 2. Check for In-Progress Exam on Page Mount (Refresh Resilience) ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.attempt_id && parsed.deadline_at) {
          const remaining = Math.floor((new Date(parsed.deadline_at).getTime() - Date.now()) / 1000);
          if (remaining > 0) {
            // Re-sync with server
            setStudent({
              full_name: parsed.student_name || "",
              student_id: parsed.student_id || "",
              phone: parsed.phone || ""
            });
            setField(parsed.field || "Natural");
            setAttemptId(parsed.attempt_id);
            setQuestions(parsed.questions || []);
            setAnswers(parsed.answers || {});
            answersRef.current = parsed.answers || {};
            setTimeLeft(remaining);
            setStep("exam");
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (_) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ── 3. Warn User Before Leaving / Reloading Active Exam ──────
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

  // ── 4. Total Countdown Timer ────────────────────────────────
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

  // ── 5. Form Validation ──────────────────────────────────────
  function validateForm() {
    const errs = {};
    if (!student.full_name.trim() || student.full_name.trim().length < 3)
      errs.full_name = "Full name must be at least 3 characters.";
    if (!student.student_id.trim()) {
      errs.student_id = "Student ID is required.";
    } else if (!validateStudentId(student.student_id)) {
      errs.student_id = "Student ID must follow format RU/XXXX/XX (e.g. RU/1234/17).";
    }
    if (!validateEthiopianPhone(student.phone))
      errs.phone = "Enter a valid Ethiopian phone number (e.g. 09XXXXXXXX, 07XXXXXXXX, or +251...).";
    return errs;
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});
    setStep("select");
  }

  // ── 6. Start / Resume Exam ──────────────────────────────────
  async function handleStartExam() {
    setStep("submitting");
    setErrorMsg("");

    const targetSub = subjects.find((s) => s.id === selectedSubjectId || s.code === selectedSubjectId);
    if (!targetSub) {
      setErrorMsg("Please select a subject.");
      setStep("select");
      return;
    }

    try {
      const payload = {
        student_name: student.full_name.trim(),
        student_id: student.student_id.trim(),
        phone: student.phone.trim(),
        field,
        subject_id: targetSub.id || targetSub.code
      };

      const res = await fetch(`${BOT_API}/api/exam/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to start exam.");
      }

      setAttemptId(data.attempt_id);
      setQuestions(data.questions || []);
      setCurrentIdx(0);
      const initialAnswers = data.saved_answers || {};
      setAnswers(initialAnswers);
      answersRef.current = initialAnswers;
      setTimeLeft(data.remaining_seconds || targetSub.duration_minutes * 60);

      // Save to localStorage for refresh recovery
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          attempt_id: data.attempt_id,
          deadline_at: data.deadline_at,
          student_name: student.full_name,
          student_id: student.student_id,
          phone: student.phone,
          field,
          questions: data.questions,
          answers: initialAnswers
        })
      );

      setStep("exam");
    } catch (err) {
      setErrorMsg(err.message || "Failed to begin exam.");
      setStep("error");
    }
  }

  // ── 7. Handle Option Selection ──────────────────────────────
  function handleSelectOption(optionId) {
    const q = questions[currentIdx];
    if (!q) return;

    setAnswers((prev) => {
      const updated = { ...prev, [q.id]: optionId };
      answersRef.current = updated;

      // Update local storage backup
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

  // ── 8. Submit Answers ───────────────────────────────────────
  const submitExamToServer = useCallback(async () => {
    clearInterval(timerRef.current);
    setShowConfirmModal(false);
    setStep("submitting");

    try {
      const payload = {
        attempt_id: attemptId,
        answers: answersRef.current
      };

      const res = await fetch(`${BOT_API}/api/exam/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission error.");
      }

      // Clear local storage active attempt
      localStorage.removeItem(STORAGE_KEY);

      setResult(data);
      setStep("result");
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit exam.");
      setStep("error");
    }
  }, [attemptId]);

  function handleAutoSubmit() {
    submitExamToServer();
  }

  // ── Current State Calculations ──────────────────────────────
  const currentQ = questions[currentIdx];
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId || s.code === selectedSubjectId);
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isTimerDanger = timeLeft <= 300; // last 5 minutes (turns red)

  return (
    <>
      <Navbar />
      <main className="exam-page">
        <div className="exam-shell">

          {/* ── STEP 1: REGISTRATION ────────────────────────── */}
          {step === "register" && (
            <div className="exam-card">
              <div className="exam-card__icon">📝</div>
              <h1 className="exam-card__title">CSH Mock Exam Portal</h1>
              <p className="exam-card__subtitle">
                Authentic freshman mid-term and final examination simulator. Please register with your student credentials.
              </p>

              <form className="exam-form" onSubmit={handleRegisterSubmit} noValidate>
                <div className="exam-field">
                  <label className="exam-label" htmlFor="full_name">Full Name *</label>
                  <input
                    id="full_name"
                    className={`exam-input${formErrors.full_name ? " exam-input--error" : ""}`}
                    type="text"
                    placeholder="e.g. Abebe Bikila"
                    value={student.full_name}
                    onChange={(e) => setStudent({ ...student, full_name: e.target.value })}
                    autoComplete="name"
                  />
                  {formErrors.full_name && <span className="exam-error-msg">{formErrors.full_name}</span>}
                </div>

                <div className="exam-field">
                  <label className="exam-label" htmlFor="student_id">Student ID (RU/XXXX/XX) *</label>
                  <input
                    id="student_id"
                    className={`exam-input${formErrors.student_id ? " exam-input--error" : ""}`}
                    type="text"
                    placeholder="e.g. RU/1234/17"
                    value={student.student_id}
                    onChange={(e) => setStudent({ ...student, student_id: e.target.value.toUpperCase() })}
                  />
                  {formErrors.student_id && <span className="exam-error-msg">{formErrors.student_id}</span>}
                </div>

                <div className="exam-field">
                  <label className="exam-label" htmlFor="phone">Phone Number (Ethiopian) *</label>
                  <input
                    id="phone"
                    className={`exam-input${formErrors.phone ? " exam-input--error" : ""}`}
                    type="tel"
                    placeholder="e.g. 0912345678, 0712345678, or +251..."
                    value={student.phone}
                    onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                    autoComplete="tel"
                  />
                  {formErrors.phone && <span className="exam-error-msg">{formErrors.phone}</span>}
                </div>

                <button className="btn btn-primary exam-submit-btn" type="submit">
                  Continue to Exam Selection →
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 2: FIELD & SUBJECT SELECTION ───────────── */}
          {step === "select" && (
            <div className="exam-card">
              <div className="exam-card__icon">🎯</div>
              <h2 className="exam-card__title">Choose Your Field & Subject</h2>
              <p className="exam-card__subtitle">
                Student: <strong>{student.full_name}</strong> ({student.student_id})
              </p>

              <div className="exam-section-label">1. Choose Field</div>
              <div className="exam-stream-group">
                <button
                  type="button"
                  className={`exam-stream-btn${field === "Natural" ? " active" : ""}`}
                  onClick={() => setField("Natural")}
                >
                  🔬 Natural Science
                </button>
                <button
                  type="button"
                  className={`exam-stream-btn${field === "Social" ? " active" : ""}`}
                  onClick={() => setField("Social")}
                >
                  📚 Social Science
                </button>
              </div>

              <div className="exam-section-label" style={{ marginTop: "1.75rem" }}>
                2. Choose Subject ({field} Science)
              </div>
              <div className="exam-subject-grid">
                {filteredSubjects.map((s) => {
                  const isSelected = selectedSubjectId === s.id || selectedSubjectId === s.code;
                  return (
                    <button
                      key={s.code}
                      type="button"
                      className={`exam-subject-btn${isSelected ? " active" : ""}`}
                      onClick={() => setSelectedSubjectId(s.id || s.code)}
                    >
                      <span className="exam-subject-icon">{s.icon || "📚"}</span>
                      <span className="exam-subject-name">{s.title}</span>
                      <div className="exam-subject-meta">
                        <span>📝 {s.question_count || 20} Qs</span>
                        <span>•</span>
                        <span>⏱ {s.time_label || `${s.duration_minutes}m`}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="exam-info-box">
                <span>🛡️</span>
                <div>
                  <strong>Strict Exam Rules:</strong> Total countdown timer runs continuously on the server. Refreshing keeps your remaining time. Final score calculated out of <strong>20.0</strong>. Maximum 1 attempt allowed.
                </div>
              </div>

              <div className="exam-action-row">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep("register")}
                >
                  ← Edit Credentials
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStartExam}
                >
                  🚀 Start Exam
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: EXAM SCREEN ─────────────────────────── */}
          {step === "exam" && currentQ && (
            <div className="exam-card">
              {/* Top Navigation & Countdown Timer */}
              <div className="exam-topbar">
                <div className="exam-topbar-info">
                  <span className="exam-subject-badge">
                    {activeSubject?.title || "Exam"} · {field} Science
                  </span>
                  <span className="exam-student-tag">
                    {student.full_name} ({student.student_id})
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

              {/* Question Display */}
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

              {/* Action & Navigation Bar */}
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
                  {currentIdx < totalQuestions - 1 ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setCurrentIdx((p) => Math.min(totalQuestions - 1, p + 1))}
                    >
                      Next Question →
                    </button>
                  ) : null}

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
                <h3 className="exam-modal-title">Ready to Submit?</h3>
                <p className="exam-modal-body">
                  You have answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions.
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
                    Review Answers
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={submitExamToServer}
                  >
                    Yes, Submit Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: SUBMITTING / LOADING ────────────────── */}
          {step === "submitting" && (
            <div className="exam-card exam-card--center">
              <div className="exam-spinner" aria-label="Loading..." />
              <p className="exam-loading-text">
                {questions.length === 0 ? "Loading exam questions..." : "Grading your exam & recording results..."}
              </p>
            </div>
          )}

          {/* ── STEP 5: RESULT & REVIEW ─────────────────────── */}
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
                  💪 Keep practicing! Review the explanations below and strengthen your concepts.
                </div>
              )}

              {/* Review Section */}
              {result.review && result.review.length > 0 && (
                <div className="exam-review-section">
                  <h3 className="exam-review-title">📖 Detailed Question Review & Explanations</h3>
                  {result.review.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`exam-review-card ${item.is_correct ? "correct" : "incorrect"}`}
                    >
                      <div className="exam-review-qheader">
                        <span>Question {item.question_number || idx + 1}</span>
                        <span className={`exam-review-status ${item.is_correct ? "correct" : "incorrect"}`}>
                          {item.is_correct ? "✓ Correct" : "✗ Incorrect"}
                        </span>
                      </div>
                      <div className="exam-review-qtext">{item.question_text}</div>
                      <div className="exam-review-choices">
                        <span>
                          Your Answer: <strong>{item.student_answer || "Unanswered"}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Correct Answer: <strong style={{ color: "var(--success)" }}>{item.correct_answer}</strong>
                        </span>
                      </div>
                      {item.explanation && (
                        <div className="exam-review-exp">
                          💡 <strong>Explanation:</strong> {item.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="exam-action-row exam-action-row--center" style={{ marginTop: "2rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setResult(null);
                    setStep("select");
                  }}
                >
                  Take Another Subject
                </button>
                <Link to="/quizzes" className="btn btn-primary">
                  📝 Chapter Quizzes
                </Link>
              </div>
            </div>
          )}

          {/* ── STEP 6: ERROR SCREEN ────────────────────────── */}
          {step === "error" && (
            <div className="exam-card exam-card--center">
              <div className="exam-error-icon">⚠️</div>
              <h2 className="exam-card__title">Unable to Proceed</h2>
              <p className="exam-error-body">{errorMsg || "An unexpected error occurred. Please try again."}</p>

              <div className="exam-action-row exam-action-row--center">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep("select")}
                >
                  ← Back to Selection
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStep("register")}
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
