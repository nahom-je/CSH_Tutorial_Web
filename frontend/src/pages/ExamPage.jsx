// src/pages/ExamPage.jsx — CSH Tutorial Exam Page
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../exam.css";

// ── Config ────────────────────────────────────────────────────────────────────
const BOT_API =
  import.meta.env.VITE_BOT_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://csh-tutorial-bot.onrender.com");

const SUBJECTS = [
  {
    id: "geography",
    label: "Geography",
    courseId: "08c59f6f-15bc-4c1c-8609-9ab3ff2baf34",
    code: "GEOG-1011",
    streams: ["Natural", "Social"],
    timerSec: 60,
  },
  {
    id: "mathematics",
    label: "Mathematics",
    courseId: "220aa316-adb2-4e23-8c62-f4cbafd35284",
    code: "MATH-1011",
    streams: ["Natural", "Social"],
    timerSec: 90,
  },
  {
    id: "physics",
    label: "Physics",
    courseId: "1c840ff4-c628-4209-8644-7103473423e3",
    code: "PHYS-1011",
    streams: ["Natural"],
    timerSec: 60,
  },
  {
    id: "psychology",
    label: "Psychology",
    courseId: "a3a8752e-3db0-4b5e-a5fe-f9fce257547c",
    code: "PSYC-1011",
    streams: ["Natural", "Social"],
    timerSec: 60,
  },
];

const STREAMS = ["Natural", "Social"];

function validateEthiopianPhone(phone) {
  const cleaned = (phone || "").replace(/\s+/g, "");
  return /^(09|07)\d{8}$/.test(cleaned) || /^\+2519\d{8}$/.test(cleaned) || /^\+2517\d{8}$/.test(cleaned);
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  const pct = total ? (current / total) * 100 : 0;
  return (
    <div className="exam-progress-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
        <span className="exam-progress-label">Question {current} of {total}</span>
        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--primary)" }}>{Math.round(pct)}%</span>
      </div>
      <div className="exam-progress-track">
        <div className="exam-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CountdownTimer({ seconds, maxSeconds }) {
  const pct = maxSeconds ? (seconds / maxSeconds) * 100 : 100;
  const isWarning = seconds <= 15;
  const isDanger  = seconds <= 5;
  return (
    <div className={`exam-timer ${isWarning ? "warn" : ""} ${isDanger ? "danger" : ""}`}>
      <div className="exam-timer-track">
        <div
          className="exam-timer-fill"
          style={{ width: `${pct}%`, transition: "width 1s linear" }}
        />
      </div>
      <span className="exam-timer-label">{seconds}s</span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ExamPage() {
  const [step, setStep] = useState("register"); // register | select | exam | submitting | result | error
  const [student, setStudent] = useState({ full_name: "", student_id: "", phone: "" });
  const [formErrors, setFormErrors] = useState({});
  const [stream, setStream] = useState("Natural");
  const [subjectId, setSubjectId] = useState("geography");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const answersRef = useRef({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [result, setResult] = useState(null); // { score, correct, total }
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef(null);
  const selectedSubject = SUBJECTS.find((s) => s.id === subjectId) || SUBJECTS[0];

  // Available subjects for chosen stream
  const availableSubjects = SUBJECTS.filter((s) => s.streams.includes(stream));

  // Keep subjectId valid when stream changes
  useEffect(() => {
    if (!availableSubjects.find((s) => s.id === subjectId)) {
      setSubjectId(availableSubjects[0]?.id || "geography");
    }
  }, [stream]); // eslint-disable-line

  // Sync ref with state
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ── Submit exam ───────────────────────────────────────────────────────────────
  const submitExam = useCallback(async () => {
    clearInterval(timerRef.current);
    setStep("submitting");
    try {
      const payload = {
        full_name: student.full_name.trim(),
        student_id: student.student_id.trim(),
        phone: student.phone.trim(),
        stream,
        subject: selectedSubject.label,
        course_code: selectedSubject.code,
        course_id: selectedSubject.courseId,
        answers: questions.map((q) => ({
          question_id: q.id,
          selected_option: answersRef.current[q.id] || null,
        })),
      };
      const res = await fetch(`${BOT_API}/api/submit-exam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setResult(data);
      setStep("result");
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit exam.");
      setStep("error");
    }
  }, [student, stream, selectedSubject, questions]);

  // ── Advance Question or Auto-submit on Finish ────────────────────────────────
  const advanceQuestion = useCallback(() => {
    setCurrentIdx((prev) => {
      if (prev + 1 >= questions.length) {
        submitExam();
        return prev;
      }
      return prev + 1;
    });
  }, [questions.length, submitExam]);

  // ── Timer Effect ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== "exam" || !questions.length) return;
    const duration = selectedSubject?.timerSec || 60;
    setTimeLeft(duration);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          advanceQuestion();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIdx, step, questions.length, selectedSubject, advanceQuestion]);

  // ── Form validation ───────────────────────────────────────────────────────────
  function validateForm() {
    const errs = {};
    if (!student.full_name.trim() || student.full_name.trim().length < 3)
      errs.full_name = "Full name must be at least 3 characters.";
    if (!student.student_id.trim() || student.student_id.trim().length < 3)
      errs.student_id = "Student ID is required.";
    if (!validateEthiopianPhone(student.phone))
      errs.phone = "Enter a valid Ethiopian phone number (e.g. 0912345678).";
    return errs;
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setStep("select");
  }

  // ── Fetch questions from backend ──────────────────────────────────────────────
  async function handleStartExam() {
    setStep("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(`${BOT_API}/api/exam-questions?course_id=${selectedSubject.courseId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load questions.");
      if (!data.questions || data.questions.length === 0) throw new Error("No questions found for this subject.");
      setQuestions(data.questions);
      setCurrentIdx(0);
      setAnswers({});
      answersRef.current = {};
      setStep("exam");
    } catch (err) {
      setErrorMsg(err.message || "Failed to load questions from server.");
      setStep("error");
    }
  }

  // ── Handle answer selection ───────────────────────────────────────────────────
  function handleSelectOption(optionId) {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => {
      const updated = { ...prev, [q.id]: optionId };
      answersRef.current = updated;
      return updated;
    });
  }

  // ── Render Helpers ────────────────────────────────────────────────────────────
  const currentQ = questions[currentIdx];
  const duration = selectedSubject?.timerSec || 60;
  const isLastQuestion = questions.length > 0 && currentIdx === questions.length - 1;

  return (
    <>
      <Navbar />
      <main className="exam-page">
        <div className="exam-shell">

          {/* ── STEP: REGISTER ─────────────────────────────── */}
          {step === "register" && (
            <div className="exam-card exam-card--register">
              <div className="exam-card__icon">📝</div>
              <h1 className="exam-card__title">CSH Exam Portal</h1>
              <p className="exam-card__subtitle">
                Enter your details to begin the mock examination. All fields are required.
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
                  <label className="exam-label" htmlFor="student_id">Student ID *</label>
                  <input
                    id="student_id"
                    className={`exam-input${formErrors.student_id ? " exam-input--error" : ""}`}
                    type="text"
                    placeholder="e.g. UGR/1234/19"
                    value={student.student_id}
                    onChange={(e) => setStudent({ ...student, student_id: e.target.value })}
                  />
                  {formErrors.student_id && <span className="exam-error-msg">{formErrors.student_id}</span>}
                </div>
                <div className="exam-field">
                  <label className="exam-label" htmlFor="phone">Phone Number (Ethiopian) *</label>
                  <input
                    id="phone"
                    className={`exam-input${formErrors.phone ? " exam-input--error" : ""}`}
                    type="tel"
                    placeholder="e.g. 0912345678 or 0712345678"
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

          {/* ── STEP: SELECT STREAM & SUBJECT ──────────────── */}
          {step === "select" && (
            <div className="exam-card exam-card--select">
              <div className="exam-card__icon">🎯</div>
              <h2 className="exam-card__title">Select Stream & Subject</h2>
              <p className="exam-card__subtitle">
                Student: <strong>{student.full_name}</strong> ({student.student_id})
              </p>

              <div className="exam-section-label">1. Choose Field</div>
              <div className="exam-stream-group">
                {STREAMS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`exam-stream-btn${stream === s ? " active" : ""}`}
                    onClick={() => setStream(s)}
                  >
                    {s === "Natural" ? "🔬" : "📚"} {s} Science
                  </button>
                ))}
              </div>

              <div className="exam-section-label" style={{ marginTop: "1.5rem" }}>2. Choose Subject</div>
              <div className="exam-subject-grid">
                {availableSubjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`exam-subject-btn${subjectId === s.id ? " active" : ""}`}
                    onClick={() => setSubjectId(s.id)}
                  >
                    <span className="exam-subject-icon">
                      {s.id === "geography" ? "🌍" : s.id === "mathematics" ? "📐" : s.id === "physics" ? "⚡" : "🧠"}
                    </span>
                    <span className="exam-subject-name">{s.label}</span>
                    <span className="exam-subject-meta">
                      ⏱ {s.timerSec === 90 ? "1m 30s" : "1m 00s"} / Q
                    </span>
                  </button>
                ))}
              </div>

              <div className="exam-info-box">
                <span>ℹ️</span>
                <span>
                  Exam format: <strong>{selectedSubject.label}</strong> · {selectedSubject.timerSec === 90 ? "90 seconds" : "60 seconds"} per question · Scored out of <strong>20</strong>.
                </span>
              </div>

              <div className="exam-action-row">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep("register")}
                >
                  ← Edit Details
                </button>
                <button
                  type="button"
                  className="btn btn-primary exam-submit-btn"
                  onClick={handleStartExam}
                >
                  🚀 Start Exam
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: EXAM ENGINE ──────────────────────────── */}
          {step === "exam" && currentQ && (
            <div className="exam-card exam-card--exam">
              <div className="exam-header">
                <span className="exam-subject-badge">
                  {selectedSubject.label} · {stream} Science
                </span>
                <span style={{ fontSize: "0.825rem", color: "var(--text-muted)", fontWeight: "600" }}>
                  {student.student_id}
                </span>
              </div>

              <ProgressBar current={currentIdx + 1} total={questions.length} />
              <CountdownTimer seconds={timeLeft} maxSeconds={duration} />

              <div className="exam-question-text">{currentQ.question_text}</div>

              <div className="exam-options">
                {(currentQ.options || []).map((opt) => {
                  const selected = answers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`exam-option${selected ? " selected" : ""}`}
                      onClick={() => handleSelectOption(opt.id)}
                    >
                      <span className="exam-option-id">{opt.id}</span>
                      <span className="exam-option-text">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              <div className="exam-engine-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.75rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                  {answers[currentQ.id] ? "✓ Answer selected" : "Auto-advances when time expires"}
                </span>

                <button
                  type="button"
                  className={`btn ${isLastQuestion ? "btn-primary" : "btn-primary"}`}
                  onClick={advanceQuestion}
                  style={{ minWidth: "140px" }}
                >
                  {isLastQuestion ? "Submit Exam 🏁" : "Next Question →"}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: SUBMITTING ───────────────────────────── */}
          {step === "submitting" && (
            <div className="exam-card exam-card--center">
              <div className="exam-spinner" aria-label="Loading..." />
              <p className="exam-loading-text">
                {questions.length === 0 ? "Loading exam questions..." : "Calculating score and submitting result..."}
              </p>
            </div>
          )}

          {/* ── STEP: RESULT ───────────────────────────────── */}
          {step === "result" && result && (
            <div className="exam-card exam-card--result">
              <div className="exam-result-emoji">
                {result.score >= 16 ? "🏆" : result.score >= 14 ? "🎉" : result.score >= 10 ? "👍" : "📚"}
              </div>
              <h2 className="exam-card__title">Exam Completed!</h2>
              <div className={`exam-score-display ${result.score >= 14 ? "pass" : "below"}`}>
                <span className="exam-score-num">{result.score}</span>
                <span className="exam-score-denom">/ 20</span>
              </div>
              <p className="exam-result-detail">
                You answered <strong>{result.correct}</strong> out of{" "}
                <strong>{result.total}</strong> questions correctly.
              </p>
              <p className="exam-result-meta">
                {selectedSubject?.label} ({stream} Science) · {student.full_name} · {student.student_id}
              </p>
              {result.score >= 14 && (
                <div className="exam-result-congrats">
                  🌟 Excellent performance! Score submitted to administration.
                </div>
              )}
              {result.score < 14 && (
                <div className="exam-result-encourage">
                  💪 Keep practicing! You can review chapter notes and retake later.
                </div>
              )}
              <div className="exam-action-row exam-action-row--center">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => { setStep("select"); setResult(null); }}
                >
                  Take Another Exam
                </button>
                <Link to="/quizzes" className="btn btn-primary">
                  📝 Chapter Quizzes
                </Link>
              </div>
            </div>
          )}

          {/* ── STEP: ERROR ────────────────────────────────── */}
          {step === "error" && (
            <div className="exam-card exam-card--center">
              <div className="exam-error-icon">⚠️</div>
              <h2 className="exam-card__title">Error Occurred</h2>
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
