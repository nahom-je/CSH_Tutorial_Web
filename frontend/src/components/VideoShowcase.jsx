// src/components/VideoShowcase.jsx
import { useState, useRef } from "react";
import { BOT_USERNAME, MAIN_CHANNEL_LINK } from "../data/courses";

const HIGHLIGHTS = [
  {
    icon: "🎯",
    title: "JU Freshman Curriculum",
    desc: "Tailored specifically for Jimma University course outlines across Natural and Social science streams.",
  },
  {
    icon: "🗣️",
    title: "Bilingual Explanations",
    desc: "Short, crystal-clear summaries in Amharic & English to make complex lecture concepts easy to understand.",
  },
  {
    icon: "⚡",
    title: "Shortcuts & Problem Solving",
    desc: "Step-by-step methods for Maths, Physics, Logic, and Economics designed to save time during exams.",
  },
  {
    icon: "📝",
    title: "Past JU Exams Solved",
    desc: "Real mid and final exam questions broken down with complete answers and step-by-step reasoning.",
  },
];

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  return (
    <section className="video-section" id="orientation" aria-labelledby="video-heading">
      <div className="container">
        {/* Header */}
        <div className="video-section-header">
          <div className="badge video-badge">
            <span>🎬 Official Orientation</span>
          </div>
          <h2 className="section-title" id="video-heading">
            How to Ace Your Freshman Year <span className="text-gradient">with CSH</span>
          </h2>
          <p className="section-subtitle">
            በጅማ ዩኒቨርሲቲ Freshman A+ ውጤት እንዴት ማምጣት ይቻላል? Watch this quick 2-minute guide to see how CSH supports your academic success.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="video-showcase-container">
          <div className="video-ambient-glow" aria-hidden="true" />

          <div className="video-window">
            {/* Window bar */}
            <div className="video-window-header">
              <div className="video-window-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="video-window-title">
                <span>📹 CSH_Tutorial_Freshman_Orientation.mp4</span>
              </div>
              <div className="video-window-badge">
                <span>JU Freshmen Guide</span>
              </div>
            </div>

            {/* Video Player Wrapper */}
            <div className="video-player-wrapper">
              <video
                ref={videoRef}
                className="main-video-player"
                src="/videos/csh-orientation.mp4"
                preload="metadata"
                controls={isPlaying}
                playsInline
                onEnded={handleVideoEnded}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />

              {/* Custom Cover / Play Overlay */}
              {!isPlaying && (
                <div
                  className="video-overlay"
                  onClick={handlePlayClick}
                  role="button"
                  tabIndex={0}
                  aria-label="Play orientation video"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handlePlayClick();
                    }
                  }}
                >
                  <div className="video-overlay-tint" />
                  
                  {/* Center Play Button */}
                  <div className="video-play-btn-pulse">
                    <div className="video-play-btn">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Overlay text tags */}
                  <div className="video-overlay-info">
                    <div className="video-tag-chip">
                      <span className="pulse-dot" />
                      <span>2:06 Min • Watch Video</span>
                    </div>
                    <h3 className="video-overlay-title">
                      Freshman በጅማ ዩኒቨርሲቲ A+ ውጤት እንዴት ማምጣት ይቻላል?
                    </h3>
                    <p className="video-overlay-sub">
                      Tap anywhere to play with audio (Amharic &amp; English)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights from the Video */}
        <div className="video-highlights-grid">
          {HIGHLIGHTS.map((item, i) => (
            <div className="card video-highlight-card" key={i}>
              <div className="video-highlight-icon" aria-hidden="true">
                {item.icon}
              </div>
              <h4 className="video-highlight-title">{item.title}</h4>
              <p className="video-highlight-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Action Banner */}
        <div className="video-action-strip">
          <div className="video-action-text">
            <h4>Ready to start your freshman semester with confidence?</h4>
            <p>Join hundreds of JU students preparing ahead with CSH Tutorial.</p>
          </div>
          <div className="video-action-buttons">
            <a
              href={`https://t.me/${BOT_USERNAME}?start=video_orientation`}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
              id="video-cta-register"
            >
              🚀 Register on Telegram Bot
            </a>
            <a
              href={MAIN_CHANNEL_LINK}
              className="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
              id="video-cta-channel"
            >
              📢 Join Official Channel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
