/**
 * FAQ.tsx
 * Animated accordion FAQ using CSS grid height trick (no Framer Motion dep).
 */

import { useState } from "react";

const FAQS = [
  {
    q: "Is MP3Snap free to use?",
    a: "Yes, completely free. No account required, no download limits, no hidden fees.",
  },
  {
    q: "What YouTube formats and qualities are supported?",
    a: "MP3 at 128, 192, and 320kbps; MP4 at 720p and 1080p. Quality depends on what the original video offers.",
  },
  {
    q: "Does it work with YouTube Shorts and YouTube Music?",
    a: "Yes. Paste any youtube.com, youtu.be, Shorts (/shorts/…), or music.youtube.com link and it will work.",
  },
  {
    q: "How long are my files available to download?",
    a: "Converted files are available for 1 hour after conversion, then permanently deleted from our servers.",
  },
  {
    q: "Is it legal to download YouTube videos?",
    a: "Downloading publicly available content for personal, offline use is generally acceptable in most regions. Converting copyrighted material for redistribution violates YouTube's Terms of Service and copyright law. Use responsibly.",
  },
  {
    q: "Why is my video taking a long time?",
    a: "High-resolution videos (1080p) or long videos (60+ minutes) require more processing time. Most conversions finish in under 30 seconds.",
  },
];

function AccordionItem({ q, a, open, onToggle }: {
  q: string; a: string; open: boolean; onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.1rem 0",
          textAlign: "left",
          color: open ? "#fff" : "rgba(232,232,240,0.85)",
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          fontWeight: 600,
          gap: "1rem",
          transition: "color 0.15s",
        }}
      >
        {q}
        <span
          style={{
            flexShrink: 0,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: open ? "var(--color-snap-red)" : "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
            transition: "background 0.18s, transform 0.25s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            color: "#fff",
          }}
        >
          +
        </span>
      </button>

      {/* Animated height via CSS grid trick */}
      <div
        className={`accordion-content${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        <div className="accordion-inner">
          <p
            style={{
              color: "rgba(232,232,240,0.6)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              paddingBottom: "1.1rem",
              margin: 0,
            }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section style={{ padding: "0 1.25rem 6rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-snap-red)",
              marginBottom: "0.6rem",
            }}
          >
            FAQ
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Common questions
          </h2>
        </div>

        {/* Accordions */}
        <div className="glass" style={{ borderRadius: 16, padding: "0 1.5rem" }}>
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              q={faq.q}
              a={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
