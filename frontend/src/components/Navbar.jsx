// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { BOT_USERNAME } from "../data/courses";
import logo from "../assets/LOGO.jpg";

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#benefits",  label: "Why CSH Tutorial" },
    { href: "#courses",   label: "Courses"           },
    { href: "#pricing",   label: "Pricing"           },
    { href: "#how",       label: "How It Works"      },
    { href: "#faq",       label: "FAQ"               },
  ];

  return (
    <>
      <nav className="navbar" style={{ boxShadow: scrolled ? "0 4px 20px -2px rgba(15, 23, 42, 0.08)" : "none" }}>
        <div className="container navbar-inner">
          <a href="#home" className="logo" aria-label="CSH Tutorial Home">
            <img src={logo} alt="CSH Tutorial Logo" style={{ height: "38px", width: "38px", objectFit: "cover", borderRadius: "8px", marginRight: "0.5rem", verticalAlign: "middle" }} />
            CSH Tutorial
          </a>

          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
              </li>
            ))}
          </ul>

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
      </nav>

      {/* Mobile menu */}
      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <a
          href={`https://t.me/${BOT_USERNAME}?start=full`}
          className="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          🚀 Get Access
        </a>
      </nav>
    </>
  );
}
