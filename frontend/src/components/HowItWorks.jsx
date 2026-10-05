// src/components/HowItWorks.jsx
const STEPS = [
  {
    n: 1,
    title: "Choose Your Plan",
    desc:  "Pick Semester 1, Semester 2, or the Full Year bundle from the pricing section.",
  },
  {
    n: 2,
    title: "Chat with the Bot",
    desc:  'Click "Get Access" — our Telegram bot will collect your details and show you the payment info.',
  },
  {
    n: 3,
    title: "Pay & Send Screenshot",
    desc:  "Pay the exact amount shown and send your screenshot + order code to @Umeribnukedir on Telegram.",
  },
  {
    n: 4,
    title: "Get Your Access Links",
    desc:  "After confirming your payment, the bot sends you private channel invite links and PDF materials.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how" aria-labelledby="how-heading">
      <div className="container">
        <div className="badge" style={{ marginBottom: "1rem" }}>🗺️ The Process</div>
        <h2 className="section-title" id="how-heading">
          Get access in <span className="text-gradient">4 simple steps</span>
        </h2>
        <p className="section-subtitle">
          No complicated sign-ups. Everything happens right inside Telegram.
        </p>

        <div className="steps-grid">
          {STEPS.map((step) => (
            <div className="card step-card" key={step.n}>
              <div className="step-number" aria-label={`Step ${step.n}`}>{step.n}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Safety note */}
        <div
          className="card"
          style={{
            marginTop: "2.5rem",
            padding: "1.25rem 1.5rem",
            borderColor: "#FCD34D",
            background: "#FFFBEB",
          }}
        >
          <p style={{ fontSize: "0.92rem", color: "#92400E", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
            <span aria-hidden="true" style={{ fontSize: "1.2rem" }}>⚠️</span>
            <span>
              <strong style={{ color: "#78350F" }}>Safety Notice:</strong> Only pay to the official account holder name shown in the bot.
              Nobody else is authorized to collect payments for CSH Tutorial.
              If someone else asks for payment, report it to @Umeribnukedir immediately.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
