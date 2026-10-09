import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getStoredAccess, verifyOrderAccess } from '../lib/quizAccess';


export default function QuizRunner() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [chapter, setChapter]         = useState(null);
  const [course, setCourse]           = useState(null);
  const [questions, setQuestions]     = useState([]);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers]           = useState({}); // { [qIndex]: selectedOptionId }
  const [submitted, setSubmitted]       = useState({}); // { [qIndex]: boolean }
  const [isFinished, setIsFinished]     = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [instantFeedback, setInstantFeedback] = useState(true); // default instant feedback mode
  const [filterReview, setFilterReview] = useState('all'); // 'all', 'incorrect', 'correct'
  const [showPalette, setShowPalette]   = useState(false);

  // Access verification state
  const [access, setAccess]                         = useState(() => getStoredAccess());
  const [runnerOrderInput, setRunnerOrderInput]     = useState('');
  const [runnerVerifying, setRunnerVerifying]       = useState(false);
  const [runnerVerifyError, setRunnerVerifyError]   = useState(null);

  const handleRunnerVerify = async (e) => {
    if (e) e.preventDefault();
    if (!runnerOrderInput.trim()) {
      setRunnerVerifyError('Please enter your Order Code (e.g. NT-1001).');
      return;
    }
    setRunnerVerifying(true);
    setRunnerVerifyError(null);

    const res = await verifyOrderAccess(runnerOrderInput);
    setRunnerVerifying(false);

    if (res.success) {
      setAccess(res.access);
      setRunnerOrderInput('');
    } else {
      setRunnerVerifyError(res.message || 'Could not verify order code.');
    }
  };

  const timerRef = useRef(null);


  // Load chapter and questions
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch chapter
        const { data: chData, error: chErr } = await supabase
          .from('chapters')
          .select('id, chapter_number, title, description, course_id')
          .eq('id', chapterId)
          .single();

        if (chErr || !chData) throw new Error('Chapter not found.');
        setChapter(chData);

        // 2. Fetch course
        const { data: coData } = await supabase
          .from('courses')
          .select('id, code, title, stream')
          .eq('id', chData.course_id)
          .single();
        setCourse(coData);

        // 3. Fetch questions
        const { data: qData, error: qErr } = await supabase
          .from('questions')
          .select('id, question_number, difficulty, question_text, options, correct_option, explanation')
          .eq('chapter_id', chapterId)
          .order('question_number', { ascending: true });

        if (qErr) throw qErr;
        setQuestions(qData || []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [chapterId]);

  // Stopwatch timer
  useEffect(() => {
    if (isTimerRunning && !isFinished && !loading) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, isFinished, loading]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionId) => {
    if (submitted[currentIndex] && instantFeedback) return; // already revealed
    setAnswers(prev => ({ ...prev, [currentIndex]: optionId }));

    if (instantFeedback) {
      setSubmitted(prev => ({ ...prev, [currentIndex]: true }));
    }
  };

  const handleManualSubmit = () => {
    setSubmitted(prev => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const finishQuiz = () => {
    // Mark all answered as submitted
    const newSubmitted = { ...submitted };
    questions.forEach((_, idx) => {
      newSubmitted[idx] = true;
    });
    setSubmitted(newSubmitted);
    setIsFinished(true);
    setIsTimerRunning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restartQuiz = () => {
    setAnswers({});
    setSubmitted({});
    setCurrentIndex(0);
    setIsFinished(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setFilterReview('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate score
  const correctCount = questions.reduce((acc, q, idx) => {
    const chosen = answers[idx];
    return acc + (chosen && chosen.toUpperCase() === q.correct_option?.toUpperCase() ? 1 : 0);
  }, 0);

  const totalQuestions = questions.length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <div className="quiz-loading-screen">
        <div className="quiz-spinner-large" />
        <h2>Preparing Your Quiz...</h2>
        <p>Loading questions and explanations</p>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="quiz-error-screen">
        <div className="quiz-error-card">
          <div className="quiz-error-icon">⚠️</div>
          <h2>Unable to Load Quiz</h2>
          <p>{error || 'No questions currently available for this chapter.'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/quizzes')}>
            ← Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // ────────────────── LOCKED ACCESS CHECK ──────────────────
  if (!access) {
    return (
      <div className="quiz-runner-locked-screen">
        <div className="quiz-locked-card">
          <div className="quiz-gate-pill">🔒 Verification Required</div>
          <h2>Unlock Chapter Quiz</h2>
          <p>
            Please enter the <strong>Order Code</strong> sent to you on Telegram (e.g. <code>NT-1001</code>) to practice this chapter.
          </p>
          <form onSubmit={handleRunnerVerify} className="quiz-gate-form">
            <div className="quiz-gate-input-wrapper">
              <span className="quiz-gate-prefix">🆔</span>
              <input
                type="text"
                className="quiz-gate-input"
                placeholder="e.g. NT-1001 or 1001"
                value={runnerOrderInput}
                onChange={(e) => {
                  setRunnerOrderInput(e.target.value);
                  setRunnerVerifyError(null);
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={runnerVerifying}
              >
                {runnerVerifying ? 'Verifying...' : 'Unlock & Start →'}
              </button>
            </div>
          </form>

          {runnerVerifyError && <div className="quiz-gate-alert error">⚠️ {runnerVerifyError}</div>}

          <div className="quiz-locked-actions">
            <button className="btn btn-outline" onClick={() => navigate('/quizzes')}>
              ← Back to Course Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────── RESULTS / SUMMARY VIEW ──────────────────

  if (isFinished) {
    const passed = scorePercent >= 70;
    const reviewedQuestions = questions.map((q, idx) => {
      const chosen = answers[idx];
      const isCorrect = chosen && chosen.toUpperCase() === q.correct_option?.toUpperCase();
      return { ...q, idx, chosen, isCorrect };
    });

    const filtered = reviewedQuestions.filter(q => {
      if (filterReview === 'incorrect') return !q.isCorrect;
      if (filterReview === 'correct') return q.isCorrect;
      return true;
    });

    return (
      <div className="quiz-results-container">
        {/* Results Header Card */}
        <div className="quiz-results-card">
          <div className="quiz-results-badge-wrap">
            <span className={`quiz-score-badge ${passed ? 'pass' : 'needs-work'}`}>
              {passed ? '🎉 Excellent Job!' : '📖 Keep Practicing!'}
            </span>
          </div>

          <div className="quiz-score-circle-wrap">
            <div className={`quiz-score-circle ${passed ? 'pass' : 'needs-work'}`}>
              <span className="quiz-score-number">{scorePercent}%</span>
              <span className="quiz-score-sub">{correctCount} / {totalQuestions}</span>
            </div>
          </div>

          <h1 className="quiz-results-title">
            {chapter?.title || 'Chapter Quiz'}
          </h1>
          <p className="quiz-results-course">
            {course?.code} • {course?.title}
          </p>

          <div className="quiz-metrics-grid">
            <div className="quiz-metric-item">
              <span className="quiz-metric-label">Correct</span>
              <span className="quiz-metric-val text-success">✓ {correctCount}</span>
            </div>
            <div className="quiz-metric-item">
              <span className="quiz-metric-label">Incorrect</span>
              <span className="quiz-metric-val text-danger">✗ {totalQuestions - correctCount}</span>
            </div>
            <div className="quiz-metric-item">
              <span className="quiz-metric-label">Time Spent</span>
              <span className="quiz-metric-val">{formatTime(timerSeconds)}</span>
            </div>
            <div className="quiz-metric-item">
              <span className="quiz-metric-label">Accuracy</span>
              <span className="quiz-metric-val">{answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%</span>
            </div>
          </div>

          <div className="quiz-results-actions">
            <button className="btn btn-primary" onClick={restartQuiz}>
              🔄 Retake Quiz
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/quizzes')}>
              📚 All Chapters
            </button>
            <Link to="/" className="btn btn-ghost">
              🏠 Home
            </Link>
          </div>
        </div>

        {/* Detailed Question Review & Explanations */}
        <div className="quiz-review-section">
          <div className="quiz-review-header">
            <div>
              <h2 className="quiz-review-title">Detailed Explanations & Review</h2>
              <p className="quiz-review-subtitle">Review every question, see your chosen option, and understand the logic</p>
            </div>
            <div className="quiz-review-filters">
              <button
                className={`filter-btn ${filterReview === 'all' ? 'active' : ''}`}
                onClick={() => setFilterReview('all')}
              >
                All ({totalQuestions})
              </button>
              <button
                className={`filter-btn ${filterReview === 'incorrect' ? 'active' : ''}`}
                onClick={() => setFilterReview('incorrect')}
              >
                Incorrect ({totalQuestions - correctCount})
              </button>
              <button
                className={`filter-btn ${filterReview === 'correct' ? 'active' : ''}`}
                onClick={() => setFilterReview('correct')}
              >
                Correct ({correctCount})
              </button>
            </div>
          </div>

          <div className="quiz-review-list">
            {filtered.map((q) => {
              const options = Array.isArray(q.options) ? q.options : [];
              return (
                <div
                  key={q.id || q.idx}
                  className={`quiz-review-card ${q.isCorrect ? 'correct-card' : 'incorrect-card'}`}
                >
                  <div className="quiz-review-card-top">
                    <span className="quiz-review-qnum">Question {q.idx + 1}</span>
                    <span className={`quiz-pill-status ${q.isCorrect ? 'status-correct' : 'status-incorrect'}`}>
                      {q.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                    <span className={`quiz-diff-badge diff-${q.difficulty?.toLowerCase()}`}>
                      {q.difficulty || 'Normal'}
                    </span>
                  </div>

                  <p className="quiz-review-question-text">{q.question_text}</p>

                  <div className="quiz-review-options-grid">
                    {options.map((opt) => {
                      const optId = typeof opt === 'string' ? opt : opt.id;
                      const optText = typeof opt === 'string' ? opt : opt.text;
                      const isUserChoice = q.chosen?.toUpperCase() === optId?.toUpperCase();
                      const isCorrectChoice = q.correct_option?.toUpperCase() === optId?.toUpperCase();

                      let stateClass = '';
                      if (isCorrectChoice) stateClass = 'is-correct-option';
                      else if (isUserChoice) stateClass = 'is-wrong-option';

                      return (
                        <div key={optId} className={`quiz-review-option-pill ${stateClass}`}>
                          <span className="opt-marker">{optId}</span>
                          <span className="opt-body">{optText}</span>
                          {isCorrectChoice && <span className="opt-tag tag-correct">Correct Answer</span>}
                          {isUserChoice && !isCorrectChoice && <span className="opt-tag tag-user">Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="quiz-explanation-box">
                      <div className="quiz-explanation-header">
                        💡 <strong>Explanation & Key Takeaway:</strong>
                      </div>
                      <p className="quiz-explanation-content">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ────────────────── ACTIVE QUIZ RUNNER VIEW ──────────────────
  const isAnswered = answers[currentIndex] !== undefined;
  const isQuestionSubmitted = submitted[currentIndex] === true;
  const selectedOption = answers[currentIndex];
  const isCorrect = selectedOption && selectedOption.toUpperCase() === currentQ?.correct_option?.toUpperCase();
  const options = Array.isArray(currentQ?.options) ? currentQ.options : [];

  return (
    <div className="quiz-runner-wrap">
      {/* Top sticky navigation bar */}
      <header className="quiz-runner-nav">
        <div className="quiz-nav-left">
          <button className="quiz-back-btn" onClick={() => navigate('/quizzes')} title="Back to chapter list">
            ← Chapters
          </button>
          <div className="quiz-nav-info">
            <span className="quiz-course-tag">{course?.code || 'Quiz'}</span>
            <span className="quiz-nav-title">{chapter?.title}</span>
          </div>
        </div>

        <div className="quiz-nav-center">
          <div className="quiz-progress-info">
            <span>Question <strong>{currentIndex + 1}</strong> of {totalQuestions}</span>
            <span className="quiz-timer-pill">⏱ {formatTime(timerSeconds)}</span>
          </div>
          <div className="quiz-progress-track">
            <div
              className="quiz-progress-fill"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="quiz-nav-right">
          <button
            className={`quiz-palette-toggle-btn ${showPalette ? 'active' : ''}`}
            onClick={() => setShowPalette(!showPalette)}
            title="Question Navigator"
          >
            📋 {answeredCount}/{totalQuestions}
          </button>
          <button
            className="quiz-finish-early-btn"
            onClick={() => {
              if (window.confirm('Finish quiz now and see your results?')) finishQuiz();
            }}
          >
            Submit Quiz
          </button>
        </div>
      </header>

      {/* Floating Question Navigator Palette */}
      {showPalette && (
        <div className="quiz-palette-dropdown">
          <div className="quiz-palette-head">
            <span>Jump to Question</span>
            <button onClick={() => setShowPalette(false)}>✕</button>
          </div>
          <div className="quiz-palette-grid">
            {questions.map((q, idx) => {
              const answered = answers[idx] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={idx}
                  className={`palette-num-btn ${isCurrent ? 'current' : ''} ${answered ? 'answered' : ''}`}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowPalette(false);
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Question Card Area */}
      <main className="quiz-runner-body">
        <div className="quiz-card-container">
          {/* Question Card */}
          <div className="quiz-active-card">
            <div className="quiz-card-meta">
              <div className="quiz-meta-left">
                <span className="quiz-qnum-badge">Q{currentIndex + 1}</span>
                <span className={`quiz-diff-badge diff-${currentQ?.difficulty?.toLowerCase()}`}>
                  {currentQ?.difficulty || 'Medium'}
                </span>
              </div>
              <div className="quiz-mode-pill">
                <label className="quiz-toggle-label">
                  <input
                    type="checkbox"
                    checked={instantFeedback}
                    onChange={(e) => setInstantFeedback(e.target.checked)}
                  />
                  <span>Instant Explanation</span>
                </label>
              </div>
            </div>

            <div className="quiz-question-box">
              <h2 className="quiz-question-title">{currentQ?.question_text}</h2>
            </div>

            {/* Options list */}
            <div className="quiz-options-list">
              {options.map((opt) => {
                const optId = typeof opt === 'string' ? opt : opt.id;
                const optText = typeof opt === 'string' ? opt : opt.text;
                const isSelected = selectedOption?.toUpperCase() === optId?.toUpperCase();
                const isOptionCorrect = currentQ?.correct_option?.toUpperCase() === optId?.toUpperCase();

                let optionStateClass = '';
                if (isQuestionSubmitted) {
                  if (isOptionCorrect) {
                    optionStateClass = 'option-correct';
                  } else if (isSelected) {
                    optionStateClass = 'option-incorrect';
                  } else {
                    optionStateClass = 'option-dimmed';
                  }
                } else if (isSelected) {
                  optionStateClass = 'option-selected';
                }

                return (
                  <button
                    key={optId}
                    type="button"
                    className={`quiz-option-btn ${optionStateClass}`}
                    onClick={() => handleSelectOption(optId)}
                    disabled={isQuestionSubmitted && instantFeedback}
                  >
                    <span className="quiz-opt-letter">{optId}</span>
                    <span className="quiz-opt-text">{optText}</span>
                    {isQuestionSubmitted && isOptionCorrect && (
                      <span className="quiz-opt-icon check">✓ Correct</span>
                    )}
                    {isQuestionSubmitted && isSelected && !isOptionCorrect && (
                      <span className="quiz-opt-icon cross">✗ Your Choice</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* If Practice Mode is off, show manual 'Check Answer' button */}
            {!instantFeedback && !isQuestionSubmitted && isAnswered && (
              <div className="quiz-check-btn-wrap">
                <button className="btn btn-secondary" onClick={handleManualSubmit}>
                  Check Answer & Show Explanation
                </button>
              </div>
            )}

            {/* Explanation revelation */}
            {isQuestionSubmitted && currentQ?.explanation && (
              <div className={`quiz-explanation-card ${isCorrect ? 'explain-success' : 'explain-alert'}`}>
                <div className="quiz-explanation-header">
                  <span className="explain-icon">{isCorrect ? '🎉' : '💡'}</span>
                  <div>
                    <h3 className="explain-title">
                      {isCorrect ? 'Well done! Explanation:' : 'Review Explanation:'}
                    </h3>
                    <p className="explain-correct-answer">
                      Correct Answer: <strong>{currentQ?.correct_option}</strong>
                    </p>
                  </div>
                </div>
                <div className="quiz-explanation-text">
                  {currentQ.explanation}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="quiz-footer-actions">
            <button
              className="btn btn-outline"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>

            <div className="quiz-footer-status">
              <span>{currentIndex + 1} / {totalQuestions}</span>
            </div>

            {currentIndex < totalQuestions - 1 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next Question →
              </button>
            ) : (
              <button className="btn btn-gold" onClick={finishQuiz}>
                Complete Quiz & See Score 🏁
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
