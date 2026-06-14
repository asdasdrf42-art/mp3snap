/**
 * Hero.tsx
 * Main conversion input: validates YouTube URLs, shows inline errors,
 * and fires the onConvert callback on submit.
 */

import { useState, useRef } from "react";

const YT_PATTERN =
  /^https?:\/\/(www\.|m\.|music\.)?youtube\.com\/(watch\?.*v=|shorts\/|embed\/)|^https?:\/\/youtu\.be\//i;

const DEMO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

interface HeroProps {
  onConvert: (url: string) => void;
}

export default function Hero({ onConvert }: HeroProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (value: string): string => {
    if (!value.trim()) return "Paste a YouTube link to get started.";
    if (!YT_PATTERN.test(value.trim()))
      return "That doesn't look like a YouTube URL – try youtube.com or youtu.be.";
    return "";
  };

  const handleSubmit = () => {
    const err = validate(url);
    if (err) {
      setError(err);
      inputRef.current?.focus();
      return;
    }
    setError("");
    onConvert(url.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleDemo = () => {
    setUrl(DEMO_URL);
    setError("");
    setTimeout(() => onConvert(DEMO_URL), 80);
  };

  return (
    <section
      className="flex flex-col items-center"
      style={{ padding: "5rem 1.25rem 3.5rem", textAlign: "center" }}
    >
      {/* Badge */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,45,85,0.12)",
          border: "1px solid rgba(255,45,85,0.3)",
          borderRadius: 999,
          padding: "4px 14px",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#ff6b9d",
          marginBottom: "1.5rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        <span>●</span> Free · No signup · No limits
      </span>

      {/* Headline */}
      <h1
        className="font-display"
        style={{
          fontSize: "clamp(2.2rem, 6vw, 4rem)",
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "#fff",
          marginBottom: "1rem",
          maxWidth: 700,
        }}
      >
        Convert YouTube to{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #ff2d55, #ff6b9d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          MP3 or MP4
        </span>{" "}
        instantly
      </h1>

      <p
        style={{
          color: "rgba(232,232,240,0.6)",
          fontSize: "1.1rem",
          lineHeight: 1.6,
          maxWidth: 500,
          marginBottom: "2.5rem",
        }}
      >
        Paste any YouTube, Shorts, or Music link. Pick your quality.
        Download in seconds.
      </p>

      {/* Input group */}
      <div style={{ width: "100%", maxWidth: 600 }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <input
            ref={inputRef}
            type="url"
            className={`url-input${error ? " error" : ""}`}
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(validate(e.target.value));
            }}
            onKeyDown={handleKeyDown}
            aria-label="YouTube URL"
            aria-describedby={error ? "url-error" : undefined}
            style={{ flex: 1, minWidth: 0 }}
          />
          <button
            className="btn-snap"
            onClick={handleSubmit}
            style={{ padding: "0.85rem 1.75rem", fontSize: "1rem", whiteSpace: "nowrap" }}
          >
            Convert →
          </button>
        </div>

        {/* Inline error */}
        {error && (
          <p
            id="url-error"
            role="alert"
            style={{
              color: "#ff6b6b",
              fontSize: "0.84rem",
              marginTop: "0.5rem",
              textAlign: "left",
            }}
          >
            {error}
          </p>
        )}

        {/* Demo trigger */}
        <button
          onClick={handleDemo}
          style={{
            marginTop: "0.9rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(232,232,240,0.4)",
            fontSize: "0.8rem",
            textDecoration: "underline",
            textDecorationStyle: "dotted",
          }}
        >
          Try with a demo video
        </button>
      </div>

      {/* Trust indicators */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          marginTop: "3rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { icon: "⚡", text: "Fast conversion" },
          { icon: "🔒", text: "No data stored" },
          { icon: "🎧", text: "320kbps quality" },
          { icon: "📱", text: "Works on mobile" },
        ].map(({ icon, text }) => (
          <span
            key={text}
            style={{
              color: "rgba(232,232,240,0.45)",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {icon} {text}
          </span>
        ))}
      </div>
    </section>
  );
}
