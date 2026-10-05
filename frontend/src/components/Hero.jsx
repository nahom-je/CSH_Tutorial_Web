// src/components/Hero.jsx
import { BOT_USERNAME, SEM_PRICE, FULL_YEAR_PRICE, COURSES } from "../data/courses";

export default function Hero() {
  const totalCourses = COURSES.sem1Natural.length + COURSES.sem1Social.length + COURSES.sem2.length;

  return (
    <section className="hero" id="home" aria-label="Hero">
      {/* Animated background soft decorative shapes */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Eyebrow badge */}
          <div className="hero-eyebrow">
            <span className="badge">🏛️ For Jimma University (JU) Freshmen</span>
          </div>

          {/* Main headline */}
          <h1 className="hero-title">
            Ace Your{" "}
            <span className="text-gradient">Freshman Year</span>
            <br />
            with CSH Tutorial
          </h1>

          {/* Sub-headline */}
          <p className="hero-subtitle">
            Structured video lessons + verified PDF study materials for Semester 1 (Natural &amp; Social Science)
            and Semester 2 courses. Pay once, learn at your own pace.
          </p>

          {/* CTA buttons */}
          <div className="hero-cta">
            <a
              id="hero-cta-full"
              href={`https://t.me/${BOT_USERNAME}?start=full`}
              className="btn btn-primary btn-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              🚀 Get Full Year — {FULL_YEAR_PRICE} ETB
            </a>
            <a
              id="hero-cta-sem1"
              href="#pricing"
              className="btn btn-outline btn-lg"
            >
              📘 See Plans &amp; Courses
            </a>
          </div>

          {/* Stats strip */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">{totalCourses}</div>
              <div className="hero-stat-label">Courses Covered</div>
            </div>
            <div className="hero-stat stat-divider">
              <div className="hero-stat-number">{SEM_PRICE} ETB</div>
              <div className="hero-stat-label">Per Semester</div>
            </div>
            <div className="hero-stat stat-divider">
              <div className="hero-stat-number">{FULL_YEAR_PRICE} ETB</div>
              <div className="hero-stat-label">Full Year Bundle</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
