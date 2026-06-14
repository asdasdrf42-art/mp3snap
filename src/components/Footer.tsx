/**
 * Footer.tsx
 * Footer with nav links + modal overlays for Privacy Policy, Terms of Service,
 * and a Contact form.
 */

import { useState } from "react";

type ModalType = "privacy" | "terms" | "contact" | null;

// ── Modal content ─────────────────────────────────────────────────────────────

function PrivacyContent() {
  return (
    <>
      <h2 className="font-display" style={{ color: "#fff", fontSize: "1.3rem", marginBottom: "1rem" }}>
        Privacy Policy
      </h2>
      <p style={{ color: "rgba(232,232,240,0.6)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1rem" }}>
        Last updated: January 1, 2026
      </p>
      {[
        ["What we collect", "We do not collect personal information. We log anonymous request metadata (IP address, timestamp, format requested) for rate limiting and abuse prevention only. These logs are purged after 7 days."],
        ["Converted files", "Temporary output files are stored on our servers for up to 1 hour after conversion, then permanently deleted. We do not access or inspect the content of files you download."],
        ["Cookies", "We use no tracking cookies, analytics scripts, or advertising pixels. The only storage used is technical (rate-limit counters in memory)."],
        ["Third parties", "We do not share, sell, or transmit any data to third parties."],
        ["Contact", "Questions? Email privacy@mp3snap.click"],
      ].map(([title, body]) => (
        <div key={title} style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ color: "#e8e8f0", fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.4rem" }}>
            {title}
          </h3>
          <p style={{ color: "rgba(232,232,240,0.6)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
            {body}
          </p>
        </div>
      ))}
    </>
  );
}

function TermsContent() {
  return (
    <>
      <h2 className="font-display" style={{ color: "#fff", fontSize: "1.3rem", marginBottom: "1rem" }}>
        Terms of Service
      </h2>
      <p style={{ color: "rgba(232,232,240,0.6)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1rem" }}>
        Last updated: January 1, 2026
      </p>
      {[
        ["Acceptable use", "MP3Snap is intended for personal, non-commercial use only. Do not use this service to download, convert, or distribute copyrighted content without the rights holder's permission."],
        ["YouTube Terms", "Use of this service may violate YouTube's Terms of Service. You are solely responsible for ensuring your use complies with applicable laws and platform rules."],
        ["No warranty", "This service is provided \"as is\" without warranty of any kind. We do not guarantee uptime, conversion success rates, or output quality."],
        ["Limitation of liability", "MP3Snap shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this service."],
        ["DMCA", "If you believe content converted via our service infringes your copyright, contact dmca@mp3snap.click with details."],
        ["Changes", "We may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms."],
      ].map(([title, body]) => (
        <div key={title} style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ color: "#e8e8f0", fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.4rem" }}>
            {title}
          </h3>
          <p style={{ color: "rgba(232,232,240,0.6)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
            {body}
          </p>
        </div>
      ))}
    </>
  );
}

function ContactContent({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to /api/contact
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#e8e8f0",
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    padding: "0.7rem 0.9rem",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "0.75rem",
  };

  return (
    <>
      <h2 className="font-display" style={{ color: "#fff", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
        Contact Us
      </h2>
      {sent ? (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>✅</span>
          <p style={{ color: "#e8e8f0", fontWeight: 600, marginBottom: "0.5rem" }}>Message sent!</p>
          <p style={{ color: "rgba(232,232,240,0.55)", fontSize: "0.875rem" }}>
            We'll get back to you at {form.email} within 48 hours.
          </p>
          <button className="btn-snap" onClick={onClose} style={{ marginTop: "1.5rem", padding: "0.7rem 1.5rem" }}>
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(232,232,240,0.5)", marginBottom: 4 }}>
            Name
          </label>
          <input
            style={inputStyle}
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />

          <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(232,232,240,0.5)", marginBottom: 4 }}>
            Email
          </label>
          <input
            style={inputStyle}
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />

          <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(232,232,240,0.5)", marginBottom: 4 }}>
            Message
          </label>
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
            required
            placeholder="How can we help?"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />

          <button
            type="submit"
            className="btn-snap"
            style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", marginTop: "0.25rem" }}
          >
            Send message
          </button>
        </form>
      )}
    </>
  );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────

function Modal({ type, onClose }: { type: ModalType; onClose: () => void }) {
  if (!type) return null;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdrop} role="dialog" aria-modal>
      <div className="modal-box">
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(255,255,255,0.08)",
            border: "none",
            cursor: "pointer",
            color: "#e8e8f0",
            borderRadius: 6,
            width: 30,
            height: 30,
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        {type === "privacy" && <PrivacyContent />}
        {type === "terms" && <TermsContent />}
        {type === "contact" && <ContactContent onClose={onClose} />}
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

export default function Footer() {
  const [modal, setModal] = useState<ModalType>(null);

  const link = (label: string, target: ModalType) => (
    <button
      key={label}
      onClick={() => setModal(target)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(232,232,240,0.4)",
        fontSize: "0.82rem",
        fontFamily: "var(--font-body)",
        padding: 0,
        transition: "color 0.15s",
        textDecoration: "none",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = "rgba(232,232,240,0.85)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = "rgba(232,232,240,0.4)")
      }
    >
      {label}
    </button>
  );

  return (
    <>
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "2rem 1.25rem",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <span
            className="font-display"
            style={{ color: "rgba(232,232,240,0.4)", fontSize: "0.9rem", fontWeight: 600 }}
          >
            MP3<span style={{ color: "var(--color-snap-red)" }}>Snap</span>
          </span>

          {/* Nav */}
          <nav style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {link("Privacy Policy", "privacy")}
            {link("Terms of Service", "terms")}
            {link("Contact", "contact")}
          </nav>

          {/* Copyright */}
          <span style={{ color: "rgba(232,232,240,0.25)", fontSize: "0.78rem" }}>
            © {new Date().getFullYear()} MP3Snap. Not affiliated with YouTube.
          </span>
        </div>
      </footer>

      <Modal type={modal} onClose={() => setModal(null)} />
    </>
  );
}
