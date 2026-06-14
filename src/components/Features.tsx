/**
 * Features.tsx
 * Clean grid of feature cards with subtle glass styling.
 */

const FEATURES = [
  {
    icon: "⚡",
    title: "Lightning fast",
    desc: "Most conversions complete in under 10 seconds thanks to direct stream extraction.",
  },
  {
    icon: "🎵",
    title: "High-fidelity audio",
    desc: "Choose 128, 192, or 320kbps MP3. Crystal-clear sound, no re-encoding artifacts.",
  },
  {
    icon: "📺",
    title: "720p & 1080p video",
    desc: "Download full HD MP4 with merged audio track – ready to play anywhere.",
  },
  {
    icon: "🔗",
    title: "Shorts & Music too",
    desc: "Works with youtube.com, youtu.be, Shorts, and YouTube Music links.",
  },
  {
    icon: "🔒",
    title: "Zero data stored",
    desc: "Files are auto-deleted from our servers within an hour. We never touch your data.",
  },
  {
    icon: "💸",
    title: "Always free",
    desc: "No account, no subscription, no watermarks. Unlimited conversions, forever.",
  },
];

export default function Features() {
  return (
    <section style={{ padding: "2rem 1.25rem 5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
            Why MP3Snap
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Everything you need, nothing you don't
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="glass"
              style={{
                borderRadius: 14,
                padding: "1.5rem",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(255,45,85,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "var(--color-glass-border)";
              }}
            >
              <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "0.75rem" }}>
                {icon}
              </span>
              <h3
                className="font-display"
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 0.4rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  color: "rgba(232,232,240,0.55)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
