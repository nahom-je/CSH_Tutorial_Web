// src/components/FAQ.jsx
import { useState } from "react";

const FAQS = [
  {
    q: "How long does it take to get access after I pay?",
    a: "Approval usually happens within a few hours on business days (Mon–Fri, 8am–8pm Addis Ababa time). On weekends or public holidays it may take up to 24 hours. You will receive your access links automatically through the Telegram bot once your payment is confirmed.",
  },
  {
    q: "What is the refund policy?",
    a: "If your payment is not verified within 48 hours of sending the screenshot, contact @Umeribnukedir and we will either approve or fully refund you. Once access has been delivered, refunds are not available since the digital content has been accessed.",
  },
  {
    q: "What if I sent the wrong amount?",
    a: "Contact @Umeribnukedir immediately with your order code and a screenshot of the transaction. Do not send a new payment until you hear back. We will guide you on how to resolve the difference.",
  },
  {
    q: "How do I contact support?",
    a: "Message @Umeribnukedir directly on Telegram at any time. You can also use the 'Contact @Umeribnukedir' button in the bot. We aim to respond within a few hours.",
  },
  {
    q: "Can I buy Semester 1 now and Semester 2 later?",
    a: "Yes! Currently, registration is open for Semester 1 (399 ETB). Semester 2 courses are being prepared and will be announced as soon as they are ready.",
  },
  {
    q: "Will the materials expire?",
    a: "The Telegram invite links you receive expire after 48 hours, so join the channel promptly. Once you have joined, you will have permanent access to all materials posted there.",
  },
  {
    q: "I am not a freshman yet. Can I still buy?",
    a: "The bot will ask if you are a Year 1 student. If not, it will ask if you want to be notified when we add courses for higher years. You are welcome to purchase if you want to preview or prepare ahead.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx((prev) => (prev === i ? null : i));

  return (
    <section className="faq" id="faq" aria-labelledby="faq-heading">
      <div className="container">
        <div className="badge" style={{ marginBottom: "1rem" }}>❓ FAQ</div>
        <h2 className="section-title" id="faq-heading">
          Frequently asked <span className="text-gradient">questions</span>
        </h2>
        <p className="section-subtitle">
          Can't find your answer? Message @Umeribnukedir directly on Telegram.
        </p>

        <div className="faq-grid">
          {FAQS.map((item, i) => (
            <div className="faq-item" key={i}>
              <button
                id={`faq-q-${i}`}
                className="faq-question"
                onClick={() => toggle(i)}
                aria-expanded={openIdx === i}
                aria-controls={`faq-a-${i}`}
              >
                {item.q}
                <span className="chevron" aria-hidden="true">▾</span>
              </button>
              <div
                id={`faq-a-${i}`}
                className={`faq-answer ${openIdx === i ? "open" : ""}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
              >
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
