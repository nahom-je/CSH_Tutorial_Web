// src/pages/QuizHome.jsx — Course & Chapter Selection Hub
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  checkAndProcessUrlAccess,
  verifyOrderAccess,
  clearAccess,
  normalizeOrderCode,
} from '../lib/quizAccess';

const COURSE_ICONS = {
  'PHIL-1011': '🧠',
  'PSYC-1011': '🧬',
  'GEOG-1011': '🌍',
  'MATH-1011': '➕',
  'PHYS-1011': '⚡',
  'ENGL-1011': '📝',
};

const COURSE_COLORS = {
  'PHIL-1011': '#7C3AED',
  'PSYC-1011': '#0EA5E9',
  'GEOG-1011': '#10B981',
  'MATH-1011': '#F59E0B',
  'PHYS-1011': '#EF4444',
  'ENGL-1011': '#4F46E5',
};

export default function QuizHome() {
  const [courses, setCourses]       = useState([]);
  const [chapters, setChapters]     = useState({});
  const [questionCounts, setQuestionCounts] = useState({});
  const [expanded, setExpanded]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Access control state
  const [access, setAccess]                 = useState(null);
  const [orderInput, setOrderInput]         = useState('');
  const [verifying, setVerifying]           = useState(false);
  const [verifyError, setVerifyError]       = useState(null);
  const [verifySuccess, setVerifySuccess]   = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    async function load() {
      try {
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .order('code');
        setCourses(coursesData || []);

        const allChapters = {};
        for (const c of coursesData || []) {
          const { data: chs } = await supabase
            .from('chapters')
            .select('id, chapter_number, title, description')
            .eq('course_id', c.id)
            .order('chapter_number');
          allChapters[c.id] = chs || [];
        }
        setChapters(allChapters);

        // Fetch question counts
        const { data: qData } = await supabase
          .from('questions')
          .select('chapter_id');

        const counts = {};
        if (qData) {
          for (const item of qData) {
            counts[item.chapter_id] = (counts[item.chapter_id] || 0) + 1;
          }
        }
        setQuestionCounts(counts);
      } catch (e) {
        console.error('Error fetching quiz catalog:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Check URL params (?order=NT-1001&token=...) or local storage on load
  useEffect(() => {
    checkAndProcessUrlAccess().then(saved => {
      if (saved) {
        setAccess(saved);
        setVerifySuccess(`Welcome! Order ${saved.orderCode} active.`);
      }
    });
  }, []);

  const handleVerifySubmit = async (e) => {
    if (e) e.preventDefault();
    if (!orderInput.trim()) {
      setVerifyError('Please enter your Order Code (e.g. NT-1001).');
      return;
    }
    setVerifying(true);
    setVerifyError(null);
    setVerifySuccess(null);

    const res = await verifyOrderAccess(orderInput);
    setVerifying(false);

    if (res.success) {
      setAccess(res.access);
      setVerifySuccess(res.message || `Order ${res.access.orderCode} verified!`);
      setOrderInput('');
    } else {
      setVerifyError(res.message || 'Could not verify order code. Check code and try again.');
    }
  };

  const handleResetAccess = () => {
    clearAccess();
    setAccess(null);
    setVerifySuccess(null);
    setVerifyError(null);
  };

  const handleLaunchQuiz = (chapterId) => {
    if (!access) {
      setVerifyError('Please enter and verify your Order Code to access chapter quizzes.');
      const gate = document.getElementById('quiz-order-gate');
      if (gate) {
        gate.scrollIntoView({ behavior: 'smooth' });
        gate.classList.add('pulse-highlight');
        setTimeout(() => gate.classList.remove('pulse-highlight'), 1500);
      }
      return;
    }
    navigate(`/quiz/${chapterId}`);
  };


  const totalQuestions = Object.values(questionCounts).reduce((a, b) => a + b, 0) || 1005;
  const totalChapters = Object.values(chapters).reduce((acc, list) => acc + list.length, 0) || 36;

  const filteredCourses = courses.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesTitle = c.title?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q);
    const chs = chapters[c.id] || [];
    const matchesChapter = chs.some(ch => ch.title?.toLowerCase().includes(q));
    return matchesTitle || matchesChapter;
  });

  if (loading) return (
    <div className="quiz-loading-screen">
      <div className="quiz-spinner-large" />
      <h2>Loading Quiz Platform...</h2>
      <p>Synchronizing courses, chapters, and question banks</p>
    </div>
  );

  return (
    <div className="quiz-home-wrapper">
      {/* Top Header */}
      <header className="quiz-top-nav">
        <div className="quiz-nav-container">
          <Link to="/" className="quiz-back-home-link">
            ← Back to CSH Tutorial
          </Link>
          <div className="quiz-top-nav-right">
            {access ? (
              <div className="quiz-access-status-badge">
                <span className="quiz-status-dot active" />
                <span>Order <strong>{access.orderCode}</strong> Active</span>
                <button
                  className="quiz-access-switch-btn"
                  onClick={handleResetAccess}
                  title="Switch or reset order code"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="quiz-access-status-badge locked">
                <span className="quiz-status-dot locked" />
                <span>Verification Required</span>
              </div>
            )}
            <div className="quiz-top-badge">
              <span className="live-dot" /> 1,005 Active Questions
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="quiz-home-hero">
        <div className="quiz-hero-content">
          <div className="quiz-hero-pill">✨ Interactive Knowledge Center</div>
          <h1 className="quiz-hero-title">
            Test Your Knowledge <br />
            <span className="quiz-gradient-text">Chapter by Chapter</span>
          </h1>
          <p className="quiz-hero-subtitle">
            Take chapter-level quizzes with immediate answer feedback, detailed explanations, and performance metrics for all freshman Natural Science courses.
          </p>

          <div className="quiz-stats-counter-bar">
            <div className="quiz-counter-card">
              <span className="quiz-counter-num">{totalQuestions}</span>
              <span className="quiz-counter-label">Verified Questions</span>
            </div>
            <div className="quiz-counter-divider" />
            <div className="quiz-counter-card">
              <span className="quiz-counter-num">{totalChapters}</span>
              <span className="quiz-counter-label">Total Chapters</span>
            </div>
            <div className="quiz-counter-divider" />
            <div className="quiz-counter-card">
              <span className="quiz-counter-num">{courses.length}</span>
              <span className="quiz-counter-label">Freshman Courses</span>
            </div>
          </div>

          {/* Order Code Verification Gate Card or Verified Status Banner */}
          <div id="quiz-order-gate" className="quiz-gate-section">
            {access ? (
              <div className="quiz-verified-banner">
                <div className="quiz-verified-icon">🎉</div>
                <div className="quiz-verified-info">
                  <h4>Access Unlocked &amp; Ready</h4>
                  <p>
                    Verified with Order <strong>{access.orderCode}</strong> for <strong>{access.name || 'Student'}</strong>. 
                    You have unlimited practice access across all courses &amp; chapters!
                  </p>
                </div>
                <button className="quiz-change-code-btn" onClick={handleResetAccess}>
                  Switch Code
                </button>
              </div>
            ) : (
              <div className="quiz-order-gate-card">
                <div className="quiz-gate-head">
                  <div className="quiz-gate-pill">🔒 Verified Student Access</div>
                  <h3 className="quiz-gate-title">Enter Your Order Code to Practice</h3>
                  <p className="quiz-gate-desc">
                    Your unique Order Code was generated by our Telegram Bot (e.g. <code>NT-1001</code>) and verified by admin. Enter it below to unlock all 1,005 questions and explanations.
                  </p>
                </div>

                <form onSubmit={handleVerifySubmit} className="quiz-gate-form">
                  <div className="quiz-gate-input-wrapper">
                    <span className="quiz-gate-prefix">🆔</span>
                    <input
                      type="text"
                      className="quiz-gate-input"
                      placeholder="e.g. NT-1001 or 1001"
                      value={orderInput}
                      onChange={(e) => {
                        setOrderInput(e.target.value);
                        setVerifyError(null);
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary quiz-gate-submit-btn"
                      disabled={verifying}
                    >
                      {verifying ? 'Verifying...' : 'Unlock Quizzes →'}
                    </button>
                  </div>
                </form>

                {verifyError && <div className="quiz-gate-alert error">⚠️ {verifyError}</div>}
                {verifySuccess && <div className="quiz-gate-alert success">✅ {verifySuccess}</div>}

                <div className="quiz-gate-footer">
                  <span>Haven't joined yet?</span>
                  <a href="https://t.me/CSH_Tutorial_bot" target="_blank" rel="noreferrer">
                    Get Access on Telegram (@CSH_Tutorial_bot)
                  </a>
                  <span className="quiz-gate-dot">•</span>
                  <a href="https://t.me/Umeribnukedir" target="_blank" rel="noreferrer">
                    Contact Admin
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="quiz-search-bar-wrap">
            <input
              type="text"
              className="quiz-search-input"
              placeholder="🔍 Search course, topic, or chapter (e.g. Logic, Magnetism, Psychology)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>


      {/* Courses & Chapters Grid */}
      <section className="quiz-catalog-section">
        <div className="quiz-catalog-container">
          <div className="quiz-section-header">
            <h2>Select Your Course & Chapter</h2>
            <p>Click on any course to view available chapters and begin testing</p>
          </div>

          <div className="quiz-courses-grid">
            {filteredCourses.map(course => {
              const color = COURSE_COLORS[course.code] || '#4F46E5';
              const icon  = COURSE_ICONS[course.code]  || '📚';
              const chs   = chapters[course.id] || [];
              const isOpen = expanded === course.id;
              const isEnglish = course.code === 'ENGL-1011';

              // Calculate total questions for this course
              const courseQCount = chs.reduce((sum, ch) => sum + (questionCounts[ch.id] || 0), 0) || (isEnglish ? 45 : chs.length * 30);

              return (
                <div
                  key={course.id}
                  className={`quiz-course-card ${isOpen ? 'is-open' : ''} ${isEnglish ? 'is-english-flat' : ''}`}
                  style={{ '--course-accent': color }}
                >
                  <div className="quiz-course-card-head">
                    <div className="quiz-course-icon-box" style={{ background: `${color}18`, color }}>
                      {icon}
                    </div>

                    <div className="quiz-course-details">
                      <div className="quiz-badge-row">
                        <span className="quiz-code-pill" style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                          {course.code}
                        </span>
                        <span className="quiz-meta-badge">
                          {isEnglish ? 'Single Exam' : `${chs.length} Chapters`}
                        </span>
                        <span className="quiz-count-badge">
                          {courseQCount} Questions
                        </span>
                      </div>
                      <h3 className="quiz-course-name">{course.title}</h3>
                      {isEnglish && (
                        <p className="quiz-english-note">
                          🎯 Complete non-chapterized 45-question diagnostic & practice quiz. Available anytime.
                        </p>
                      )}
                    </div>

                    {isEnglish ? (
                      <button
                        className="btn btn-primary quiz-start-btn"
                        onClick={() => chs[0] && handleLaunchQuiz(chs[0].id)}
                      >
                        {access ? 'Start English Quiz →' : '🔒 Unlock English Quiz'}
                      </button>
                    ) : (
                      <button
                        className="quiz-accordion-btn"
                        onClick={() => setExpanded(isOpen ? null : course.id)}
                        aria-expanded={isOpen}
                      >
                        <span>{isOpen ? 'Close' : 'View Chapters'}</span>
                        <span className={`quiz-chevron ${isOpen ? 'rotated' : ''}`}>▾</span>
                      </button>
                    )}
                  </div>

                  {/* Chapters List for non-flat courses */}
                  {!isEnglish && isOpen && (
                    <div className="quiz-chapters-accordion">
                      <div className="quiz-chapters-list">
                        {chs.map(ch => {
                          const qCount = questionCounts[ch.id] || 30;
                          return (
                            <button
                              key={ch.id}
                              className="quiz-chapter-card-item"
                              onClick={() => handleLaunchQuiz(ch.id)}
                            >
                              <div className="quiz-chapter-number-pill">
                                Ch {ch.chapter_number}
                              </div>
                              <div className="quiz-chapter-content">
                                <h4 className="quiz-chapter-title">{ch.title}</h4>
                                {ch.description && (
                                  <p className="quiz-chapter-desc">{ch.description}</p>
                                )}
                              </div>
                              <div className="quiz-chapter-action">
                                <span className="quiz-ch-count">{qCount} Qs</span>
                                <span className="quiz-start-link">
                                  {access ? 'Start Quiz →' : '🔒 Unlock'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
