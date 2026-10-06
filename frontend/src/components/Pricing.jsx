// src/components/Pricing.jsx
import { useState, useEffect } from "react";
import { BOT_USERNAME, SEM_PRICE, FULL_YEAR_PRICE, COURSES } from "../data/courses";

const PLANS = [
  {
    id:       "sem1",
    label:    "Semester 1",
    emoji:    "📘",
    price:    SEM_PRICE,
    desc:     "Everything you need for your first semester.",
    features: [
      "All Semester 1 courses (Natural & Social Streams)",
      "Structured video lessons",
      "PDF study guides",
      "Private Telegram channel access",
      "Lifetime access to materials",
      "Direct support via @Umeribnukedir",
    ],
    featured: true,
    badgeText: "🔥 Available Now — Active Plan",
    btnClass: "btn-primary",
    isAvailable: true,
  },
  {
    id:       "full",
    label:    "Full Year",
    emoji:    "🎓",
    price:    FULL_YEAR_PRICE,
    desc:     "All Semester 1 + Semester 2 courses bundle.",
    features: [
      "All Semester 1 & 2 courses (Full Access)",
      "Comprehensive video lessons",
      "Full PDF study guide collection",
      "Access to the private channel",
      "Lifetime access to materials",
      "Priority support via @Umeribnukedir",
    ],
    featured: false,
    badgeText: "⏳ S1 Active Now",
    btnClass: "btn-outline",
    isAvailable: false,
  },
  {
    id:       "sem2",
    label:    "Semester 2",
    emoji:    "📗",
    price:    SEM_PRICE,
    desc:     "Dedicated bundle for your second semester.",
    features: [
      `All ${COURSES.sem2.length} Semester 2 courses`,
      "Structured video lessons",
      "PDF study guides",
      "Private Telegram channel access",
      "Lifetime access to materials",
      "Direct support via @Umeribnukedir",
    ],
    featured: false,
    btnClass: "btn-outline",
    isAvailable: false,
  },
];

export default function Pricing() {
  const [showNotice, setShowNotice] = useState(false);
  const [clickedPlan, setClickedPlan] = useState("");

  const handlePlanClick = (e, plan) => {
    if (!plan.isAvailable) {
      e.preventDefault();
      setClickedPlan(plan.label);
      setShowNotice(true);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowNotice(false);
    };
    if (showNotice) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNotice]);

  return (
    <section className="pricing" id="pricing" aria-labelledby="pricing-heading">
      <div className="container">
        <div className="badge" style={{ marginBottom: "1rem" }}>💰 Simple Pricing</div>
        <h2 className="section-title" id="pricing-heading">
          One price. <span className="text-gradient">All courses.</span>
        </h2>
        <p className="section-subtitle">
          No subscriptions. No surprise charges. Pay once and get lifetime access
          to everything in your chosen semester bundle.
        </p>

        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`card pricing-card${plan.featured ? " featured" : ""}`}
              id={`pricing-${plan.id}`}
            >
              {plan.badgeText && (
                <div
                  className="pricing-card-badge"
                  style={plan.id === "full" ? { background: "#FEF3C7", borderColor: "#FCD34D", color: "#B45309" } : {}}
                  aria-label={plan.badgeText}
                >
                  {plan.badgeText}
                </div>
              )}

              <div className="pricing-plan">
                {plan.emoji} {plan.label}
              </div>
              <p className="pricing-desc">{plan.desc}</p>

              <div className="pricing-price">
                <span
                  className={`pricing-amount ${plan.featured ? "text-gradient" : "text-primary"}`}
                >
                  {plan.price}
                </span>
                <span className="pricing-currency">ETB</span>
              </div>

              <ul className="pricing-features" aria-label={`${plan.label} features`}>
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className="check" aria-hidden="true">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                id={`pricing-cta-${plan.id}`}
                href={`https://t.me/${BOT_USERNAME}?start=${plan.id}`}
                className={`btn ${plan.btnClass}`}
                onClick={(e) => handlePlanClick(e, plan)}
                target={plan.isAvailable ? "_blank" : undefined}
                rel={plan.isAvailable ? "noopener noreferrer" : undefined}
                aria-label={`Get ${plan.label} access for ${plan.price} ETB`}
              >
                🚀 Get Access — {plan.price} ETB
              </a>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p style={{
          textAlign: "center",
          marginTop: "2rem",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
        }}>
          💳 Payment via TeleBirr or CBE. Verified manually by @Umeribnukedir.
          Approval within a few hours on business days.
        </p>
      </div>

      {/* Notice Modal Popup for 699 ETB / Full Year / Semester 2 */}
      {showNotice && (
        <div
          className="notice-modal-backdrop"
          onClick={() => setShowNotice(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-modal-title"
        >
          <div
            className="notice-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notice-modal-header">
              <span className="notice-modal-icon">📢</span>
              <h3 id="notice-modal-title" className="notice-modal-title">
                First Semester Available Now
              </h3>
            </div>

            <div className="notice-modal-body">
              <p>
                We currently only have the registration open for the <strong>First Semester plan ({SEM_PRICE} ETB)</strong>.
              </p>
              <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>
                Second semester courses are not yet prepared and will be announced as soon as they become available.
              </p>

              <div className="notice-modal-highlight">
                <span style={{ fontSize: "1.25rem" }}>📘</span>
                <div>
                  <strong>Semester 1 Bundle ({SEM_PRICE} ETB)</strong>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Includes Natural &amp; Social Science courses + video lessons &amp; study materials.
                  </div>
                </div>
              </div>
            </div>

            <div className="notice-modal-actions">
              <a
                href={`https://t.me/${BOT_USERNAME}?start=sem1`}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowNotice(false)}
              >
                👉 Get Semester 1 Plan — {SEM_PRICE} ETB
              </a>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowNotice(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
