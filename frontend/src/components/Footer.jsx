// src/components/Footer.jsx
import { BOT_USERNAME, SEM_PRICE, FULL_YEAR_PRICE } from "../data/courses";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand">
            <span className="logo" aria-label="CSH Tutorial">CSH Tutorial</span>
            <p>
              Structured course bundles for Ethiopian university freshmen.
              Videos, PDFs, and real support — all through Telegram.
            </p>
          </div>

          {/* Plans */}
          <div>
            <div className="footer-heading">Plans</div>
            <ul className="footer-links">
              <li>
                <a
                  href={`https://t.me/${BOT_USERNAME}?start=sem1`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📘 Semester 1 — {SEM_PRICE} ETB
                </a>
              </li>
              <li>
                <a
                  href={`https://t.me/${BOT_USERNAME}?start=sem2`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📗 Semester 2 — {SEM_PRICE} ETB
                </a>
              </li>
              <li>
                <a
                  href={`https://t.me/${BOT_USERNAME}?start=full`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🎓 Full Year — {FULL_YEAR_PRICE} ETB
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <div className="footer-heading">Navigate</div>
            <ul className="footer-links">
              <li><a href="#benefits">Why CSH Tutorial</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Contact & Channels */}
          <div>
            <div className="footer-heading">Contact &amp; Channels</div>
            <ul className="footer-links">
              <li>
                <a
                  href="https://t.me/campus_study_hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our main Telegram channel"
                >
                  📢 Main Channel (@campus_study_hub)
                </a>
              </li>
              <li>
                <a
                  href={`https://t.me/${BOT_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open the CSH Tutorial Telegram bot"
                >
                  🤖 @{BOT_USERNAME} (Bot)
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/Umeribnukedir"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact Umeribnukedir on Telegram"
                >
                  💬 Support: @Umeribnukedir
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {year} CSH Tutorial. All rights reserved.</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            Built for Ethiopian freshmen 🇪🇹
          </p>
        </div>
      </div>
    </footer>
  );
}
