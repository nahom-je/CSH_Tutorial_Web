// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BOT_USERNAME } from "../data/courses";
import logo from "../assets/LOGO.jpg";

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: isHomePage ? "#benefits" : "/#benefits", label: "Why CSH" },
    { href: isHomePage ? "#courses"  : "/#courses",  label: "Courses" },
    { href: isHomePage ? "#pricing"  : "/#pricing",  label: "Pricing" },
    { href: isHomePage ? "#how"      : "/#how",      label: "How It Works" },
    { href: isHomePage ? "#faq"      : "/#faq",      label: "FAQ" },
  ];

  return (
    <>
      <nav className="navbar" style={{ boxShadow: scrolled ? "0 4px 20px -2px rgba(15, 23, 42, 0.08)" : "none" }}>
        <div className="container navbar-inner">
          <Link to="/" className="logo" aria-label="CSH Tutorial Home">
            <img src={logo} alt="CSH Tutorial Logo" style={{ height: "38px", width: "38px", objectFit: "cover", borderRadius: "8px", marginRight: "0.5rem", verticalAlign: "middle" }} />
            CSH Tutorial
          </Link>

          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
              </li>
            ))}
            <li>
              <Link
                to="/quizzes"
                className="nav-quiz-link"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "600",
                  color: "var(--primary)",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "9999px",
                  background: "var(--primary-light)",
                  border: "1px solid rgba(79, 70, 229, 0.2)",
                  transition: "var(--transition)",
                }}
              >
                <span>📝 Quizzes</span>
                <span style={{
                  fontSize: "0.68rem",
                  background: "var(--primary)",
                  color: "#fff",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "9999px",
                  fontWeight: "700"
                }}>1,005 Qs</span>
              </Link>
            </li>
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              to="/quizzes"
              className="btn btn-outline nav-quiz-btn-mobile"
              style={{
                display: "none",
                padding: "0.5rem 0.9rem",
                fontSize: "0.85rem",
                borderColor: "var(--primary)",
                color: "var(--primary)",
                fontWeight: "600",
              }}
            >
              📝 Quizzes
            </Link>

            <a
              href={`https://t.me/${BOT_USERNAME}?start=full`}
              className="btn btn-primary"
              style={{ padding: "0.55rem 1.25rem", fontSize: "0.9rem" }}
              id="nav-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              🚀 Get Access
            </a>

            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <Link
          to="/quizzes"
          className="btn btn-primary"
          style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "center", gap: "8px" }}
          onClick={() => setMenuOpen(false)}
        >
          📝 Take Chapter Quizzes (1,005 Qs)
        </Link>
        {navLinks.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <a
          href={`https://t.me/${BOT_USERNAME}?start=full`}
          className="btn btn-outline"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          🚀 Telegram Bot
        </a>
      </nav>
    </>
  );
}
