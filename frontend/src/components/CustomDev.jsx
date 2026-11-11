// src/components/CustomDev.jsx — Custom Development CTA Banner
export default function CustomDev() {
  return (
    <section className="custom-dev-section" aria-label="Custom development services">
      {/* Decorative grid lines */}
      <div className="custom-dev-grid-bg" aria-hidden="true" />

      <div className="container">
        <div className="custom-dev-card">

          {/* Top badge */}
          <div className="custom-dev-badge">
            <span className="custom-dev-badge-dot" />
            Available for Projects
          </div>

          {/* Headline */}
          <h2 className="custom-dev-title">
            Need a{" "}
            <span className="custom-dev-highlight">Custom Website</span>{" "}
            or{" "}
            <span className="custom-dev-highlight">Mobile App?</span>
          </h2>

          <p className="custom-dev-subtitle">
            We design and build sleek, production-ready digital products tailored to
            your vision — from landing pages to full-stack applications.
          </p>

          {/* Contact cards */}
          <div className="custom-dev-contacts">
            <a
              href="https://t.me/NahomJ2"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-dev-contact-pill custom-dev-contact-tg"
              aria-label="Contact on Telegram"
            >
              <span className="custom-dev-contact-icon">✈️</span>
              <span className="custom-dev-contact-info">
                <span className="custom-dev-contact-label">Telegram</span>
                <span className="custom-dev-contact-value">@NahomJ2</span>
              </span>
              <span className="custom-dev-contact-phone">+251 96 454 9757</span>
            </a>

            <div className="custom-dev-contact-divider">or</div>

            <a
              href="mailto:nahomjemberu22@gmail.com"
              className="custom-dev-contact-pill custom-dev-contact-email"
              aria-label="Contact via Email"
            >
              <span className="custom-dev-contact-icon">✉️</span>
              <span className="custom-dev-contact-info">
                <span className="custom-dev-contact-label">Email</span>
                <span className="custom-dev-contact-value">nahomjemberu22@gmail.com</span>
              </span>
            </a>
          </div>

          {/* Decorative floating tags */}
          <div className="custom-dev-tags" aria-hidden="true">
            {["React", "Node.js", "Mobile Apps", "UI/UX Design", "Telegram Bots", "Full-Stack"].map(
              (tag) => (
                <span key={tag} className="custom-dev-tag">
                  {tag}
                </span>
              )
            )}
          </div>

          {/* Decorative orbs */}
          <div className="custom-dev-orb custom-dev-orb-1" aria-hidden="true" />
          <div className="custom-dev-orb custom-dev-orb-2" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

