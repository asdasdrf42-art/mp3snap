/**
 * Header.tsx
 * Sticky glassy header with brand logo, dark-mode toggle, and nav links.
 */

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogoClick: () => void;
}

export default function Header({ darkMode, onToggleDark, onLogoClick }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(10,10,15,0.72)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ maxWidth: 1120, margin: "0 auto", padding: "0 1.25rem", height: 60 }}
      >
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          aria-label="MP3Snap home"
        >
          {/* Snap icon */}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "var(--color-snap-red)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 19V13L3 7l9-4 9 4-6 6v6l-3 2-3-2Z" fill="white" />
            </svg>
          </span>
          <span
            className="font-display"
            style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}
          >
            MP3<span style={{ color: "var(--color-snap-red)" }}>Snap</span>
          </span>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <nav className="hidden" style={{ display: "flex", gap: "1.5rem" }}>
            {["Converter", "Blog", "FAQ"].map((label) => (
              <a
                key={label}
                href="#"
                style={{
                  color: "rgba(232,232,240,0.6)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color =
                    "rgba(232,232,240,0.6)")
                }
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#e8e8f0",
              fontSize: "1.05rem",
              transition: "background 0.15s",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
