// src/pages/QuizHome.jsx — Course & Chapter Selection Hub
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  checkAndProcessUrlAccess,
  verifyOrderAccess,
  clearAccess,
  normalizeOrderCode,
  getStoredAccess,
} from '../lib/quizAccess';

const COURSE_ICONS = {
  'PHIL-1011': '🧠',
  'PSYC-1011': '🧬',
  'GEOG-1011': '🌍',
  'MATH-1011': '➕',
  'PHYS-1011': '⚡',
  'ENGL-1011': '📝',
  'ECON-1011': '📈',
};

const COURSE_COLORS = {
  'PHIL-1011': '#7C3AED',
  'PSYC-1011': '#0EA5E9',
  'GEOG-1011': '#10B981',
  'MATH-1011': '#F59E0B',
  'PHYS-1011': '#EF4444',
  'ENGL-1011': '#4F46E5',
  'ECON-1011': '#059669',
};

export default function QuizHome() {
  const [courses, setCourses]       = useState([]);
  const [chapters, setChapters]     = useState({});
  const [questionCounts, setQuestionCounts] = useState({});
  const [expanded, setExpanded]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [streamFilter, setStreamFilter] = useState('all'); // 'all' | 'Natural' | 'Social'

  // Access control state
  const [access, setAccess]                 = useState(null);
  const [accessDenied, setAccessDenied]     = useState(false);
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

  // On mount: process URL params or re-validate any stored access against the server.
  // This ensures that even if someone has a stored code, their order must still be approved.
  useEffect(() => {
    async function initAccess() {
      const saved = await checkAndProcessUrlAccess();
      if (!saved) return; // No stored access — user must enter their code manually

      // Re-validate the stored code against the server to confirm status = approved
      const res = await verifyOrderAccess(saved.orderCode);
      if (res.success) {
        setAccess(res.access);
        setVerifySuccess(`Welcome back, ${res.access.name || 'Student'}!`);
      } else {
        // Stored code is no longer valid (rejected, pending, or code doesn't exist)
        clearAccess();
        setAccess(null);
        // Only show access denied if this was a URL-delivered token (not just stale storage)
        const params = new URLSearchParams(window.location.search);
        if (params.get('order') || params.get('order_code')) {
          setAccessDenied(true);
        }
      }
    }
    initAccess();
  }, []);

  const handleVerifySubmit = async (e) => {
    if (e) e.preventDefault();
    if (!orderInput.trim()) {
      setVerifyError('Please enter your Order Code (e.g. NT-8K3P9Q).');
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


  const totalQuestions = Object.values(questionCounts).reduce((a, b) => a + b, 0) || 1185;
  const totalChapters = Object.values(chapters).reduce((acc, list) => acc + list.length, 0) || 42;

  const filteredCourses = courses.filter(c => {
    const matchesStream = streamFilter === 'all' || (c.stream && c.stream.toLowerCase() === streamFilter.toLowerCase());
    const q = searchQuery.toLowerCase();
    const matchesTitle = c.title?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q);
    const chs = chapters[c.id] || [];
    const matchesChapter = chs.some(ch => ch.title?.toLowerCase().includes(q));
    return matchesStream && (matchesTitle || matchesChapter);
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
              <span className="live-dot" /> {totalQuestions} Active Questions
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
            Take chapter-level quizzes with immediate answer feedback, detailed explanations, and performance metrics for all freshman Natural and Social Science courses.
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
                  <h3 className="quiz-gate-title">Enter Your Verification Code</h3>
                  <p className="quiz-gate-desc">
                    Enter your official Order Verification Code (e.g. <code>NT-8K3P9Q</code>) provided via Telegram to unlock full access to all questions, solutions, and explanations.
                  </p>
                </div>

                <form onSubmit={handleVerifySubmit} className="quiz-gate-form">
                  <div className="quiz-gate-input-wrapper">
                    <span className="quiz-gate-prefix" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="7.5" cy="15.5" r="5.5" />
                        <path d="m21 2-9.6 9.6" />
                        <path d="m15.5 7.5 3 3L22 7l-3-3" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="quiz-gate-input"
                      placeholder="Order Code (e.g. NT-8K3P9Q)"
                      value={orderInput}
                      onChange={(e) => {
                        setOrderInput(e.target.value);
                        setVerifyError(null);
                      }}
                      autoCapitalize="characters"
                      autoCorrect="off"
                      spellCheck="false"
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
              placeholder="🔍 Search course, topic, or chapter (e.g. Economics, Logic, Magnetism, Psychology)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="quiz-stream-tabs">
              <button
                type="button"
                className={`quiz-stream-tab ${streamFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStreamFilter('all')}
              >
                🌐 All Streams ({courses.length})
              </button>
              <button
                type="button"
                className={`quiz-stream-tab ${streamFilter === 'Natural' ? 'active' : ''}`}
                onClick={() => setStreamFilter('Natural')}
              >
                🔬 Natural Science ({courses.filter(c => c.stream === 'Natural').length})
              </button>
              <button
                type="button"
                className={`quiz-stream-tab ${streamFilter === 'Social' ? 'active' : ''}`}
                onClick={() => setStreamFilter('Social')}
              >
                📚 Social Science ({courses.filter(c => c.stream === 'Social').length})
              </button>
            </div>
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
                        <span className={`quiz-stream-badge ${course.stream?.toLowerCase() === 'social' ? 'social' : 'natural'}`}>
                          {course.stream?.toLowerCase() === 'social' ? '📚 Social Science' : '🔬 Natural Science'}
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
