// src/components/Courses.jsx
import { useState } from "react";
import { COURSES, BOT_USERNAME } from "../data/courses";

function CourseCard({ course }) {
  return (
    <div className="card course-card">
      <div className="course-card-header">
        <span className="course-icon" aria-hidden="true">{course.icon}</span>
      </div>
      <h3 className="course-name">{course.name}</h3>
      <p className="course-desc">{course.description}</p>

      {course.curriculumUrl && (
        <div style={{ marginBottom: "0.75rem" }}>
          <a
            href={course.curriculumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="course-curriculum-link"
            title="View Official Jimma University Curriculum"
          >
            🏛️ Official JU Curriculum ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default function Courses() {
  const [stream, setStream] = useState("natural"); // "natural" | "social"

  const sem1Courses = stream === "natural" ? COURSES.sem1Natural : COURSES.sem1Social;
  const totalCourses = COURSES.sem1Natural.length + COURSES.sem1Social.length + COURSES.sem2.length;

  return (
    <section className="courses" id="courses" aria-labelledby="courses-heading">
      <div className="container">
        <div className="badge" style={{ marginBottom: "1rem" }}>📚 Course Library</div>
        <h2 className="section-title" id="courses-heading">
          Jimma University <span className="text-gradient">Freshman Courses</span>
        </h2>
        <p className="section-subtitle">
          Structured video lessons, lecture notes, and PDF study guides for every
          course in your curriculum. Specifically aligned for Jimma University (JU) freshmen.
        </p>

        {/* Department / Stream Selector */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Select Department / Stream:
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              type="button"
              className={`btn ${stream === "natural" ? "btn-primary" : "btn-outline"}`}
              style={{ padding: "0.45rem 1.25rem", fontSize: "0.88rem", cursor: "pointer" }}
              onClick={() => setStream("natural")}
              aria-pressed={stream === "natural"}
            >
              🔬 Natural Science
            </button>
            <button
              type="button"
              className={`btn ${stream === "social" ? "btn-primary" : "btn-outline"}`}
              style={{ padding: "0.45rem 1.25rem", fontSize: "0.88rem", cursor: "pointer" }}
              onClick={() => setStream("social")}
              aria-pressed={stream === "social"}
            >
              📚 Social Science
            </button>
          </div>
        </div>

        {/* Semester 1 */}
        <div className="semester-block">
          <div className="semester-label">
            <span className="sem-badge sem1-badge">SEM 1</span>
            <div>
              <span>Semester 1 Courses</span>
              <span className="sem-sublabel">
                {stream === "natural" ? "Natural Science Stream" : "Social Science Stream"}
              </span>
            </div>
            <span className="sem-count-tag">
              {sem1Courses.length} courses
            </span>
          </div>

          <div style={{ margin: "0.75rem 0 1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Showing <strong>{stream === "natural" ? "Natural Science" : "Social Science"}</strong> Semester 1 courses:
          </div>

          <div className="courses-grid">
            {sem1Courses.map((c) => (
              <CourseCard course={c} key={c.name} />
            ))}
          </div>

          <div style={{ marginTop: "1.75rem", textAlign: "center" }}>
            <a
              id="courses-cta-sem1"
              href={`https://t.me/${BOT_USERNAME}?start=sem1`}
              className="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Semester 1 Access →
            </a>
          </div>
        </div>

        {/* Semester 2 — Only for Natural Science */}
        {stream === "natural" && (
          <div className="semester-block">
            <div className="semester-label">
              <span className="sem-badge sem2-badge">SEM 2</span>
              <div>
                <span>Semester 2 Courses</span>
                <span className="sem-sublabel">Core Academic &amp; Pre-Engineering Foundation (Natural Science)</span>
              </div>
              <span className="sem-count-tag">
                {COURSES.sem2.length} courses
              </span>
            </div>
            <div className="courses-grid">
              {COURSES.sem2.map((c) => (
                <CourseCard course={c} key={c.name} />
              ))}
            </div>
            <div style={{ marginTop: "1.75rem", textAlign: "center" }}>
              <a
                id="courses-cta-sem2"
                href={`https://t.me/${BOT_USERNAME}?start=sem2`}
                className="btn btn-outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Semester 2 Access →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
