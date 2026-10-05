// src/components/Benefits.jsx
const BENEFITS = [
  {
    icon: "🎯",
    title: "Curriculum-Aligned",
    desc: "Every video and PDF is mapped to your actual Ethiopian university freshman syllabus — no irrelevant content.",
  },
  {
    icon: "📱",
    title: "Mobile-First Delivery",
    desc: "Access everything through Telegram. No app to install, no data-hungry platform. Works on any phone.",
  },
  {
    icon: "⚡",
    title: "Pay Once, Keep Forever",
    desc: "A one-time flat fee of 399 ETB per semester. No subscriptions, no hidden fees, no expiry.",
  },
  {
    icon: "🤝",
    title: "Real Support",
    desc: "Stuck? Message @Umeribnukedir directly on Telegram. We respond fast and we care about your success.",
  },
];

export default function Benefits() {
  return (
    <section className="benefits" id="benefits" aria-labelledby="benefits-heading">
      <div className="container">
        <div className="badge" style={{ marginBottom: "1rem" }}>✨ Why CSH Tutorial</div>
        <h2 className="section-title" id="benefits-heading">
          Everything you need to{" "}
          <span className="text-gradient">pass your first year</span>
        </h2>
        <p className="section-subtitle">
          We took the stress out of freshman year by giving you one structured
          bundle with everything — videos, notes, and direct support.
        </p>

        <div className="benefits-grid">
          {BENEFITS.map((b) => (
            <div className="card benefit-card" key={b.title}>
              <span className="benefit-icon" aria-hidden="true">{b.icon}</span>
              <h3 className="benefit-title">{b.title}</h3>
              <p className="benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
