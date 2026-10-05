// src/components/Pricing.jsx
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
    featured: false,
    btnClass: "btn-primary",
  },
  {
    id:       "full",
    label:    "Full Year",
    emoji:    "🎓",
    price:    FULL_YEAR_PRICE,
    desc:     "Best value — all Semester 1 + Semester 2 courses.",
    features: [
      "All Semester 1 & 2 courses (Full Access)",
      "Comprehensive video lessons",
      "Full PDF study guide collection",
      "Access to the private channel",
      "Lifetime access to materials",
      "Priority support via @Umeribnukedir",
    ],
    featured: true,
    badgeText: "🔥 Best Value — Save 100 ETB!",
    btnClass: "btn-gold",
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
    btnClass: "btn-primary",
  },
];

export default function Pricing() {
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
                <div className="pricing-card-badge" aria-label="Best value">{plan.badgeText}</div>
              )}

              <div className="pricing-plan">
                {plan.emoji} {plan.label}
              </div>
              <p className="pricing-desc">{plan.desc}</p>

              <div className="pricing-price">
                <span
                  className={`pricing-amount ${plan.featured ? "text-gold" : "text-gradient"}`}
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
                target="_blank"
                rel="noopener noreferrer"
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
    </section>
  );
}
