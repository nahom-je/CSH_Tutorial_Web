// src/components/PaymentMethods.jsx
const METHODS = [
  {
    icon: "📱",
    name: "TeleBirr",
    desc: "Ethiopia's most popular mobile payment. Pay directly from your phone.",
  },
  {
    icon: "🏦",
    name: "CBE (Commercial Bank of Ethiopia)",
    desc: "Bank transfer or CBE Birr. Widely available across the country.",
  },
];

export default function PaymentMethods() {
  return (
    <section className="payment-methods" id="payment" aria-labelledby="payment-heading">
      <div className="container">
        <div className="badge" style={{ marginBottom: "1rem" }}>💳 Payment</div>
        <h2 className="section-title" id="payment-heading">
          Accepted <span className="text-gradient">payment methods</span>
        </h2>
        <p className="section-subtitle">
          Payment details are shared securely through the bot after you choose your plan.
        </p>

        <div className="payment-methods-grid">
          {METHODS.map((m) => (
            <div className="card payment-method-card" key={m.name}>
              <span className="payment-method-icon" aria-hidden="true">{m.icon}</span>
              <div>
                <div className="payment-method-name">{m.name}</div>
                <div className="payment-method-desc">{m.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          🔒 Account numbers are only shared inside the Telegram bot — never on this page.
        </p>
      </div>
    </section>
  );
}
