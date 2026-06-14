/**
 * ResultView.tsx
 * Fetches video metadata from /api/analyze, shows a live skeleton → metadata
 * preview → format list flow. Handles errors with actionable messages.
 */

import { useEffect, useState } from "react";
import type { VideoInfo } from "../App.js";

interface ResultViewProps {
  initialUrl: string;
  cachedInfo: VideoInfo | null;
  onInfoLoaded: (info: VideoInfo) => void;
  onBack: () => void;
}

type Status = "loading" | "ready" | "error";

function SkeletonCard() {
  return (
    <div className="glass" style={{ borderRadius: 16, padding: "1.5rem", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="skeleton" style={{ width: 120, height: 80, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="skeleton" style={{ height: 18, width: "80%" }} />
          <div className="skeleton" style={{ height: 14, width: "50%" }} />
          <div className="skeleton" style={{ height: 14, width: "35%" }} />
        </div>
      </div>
      {/* Progress indicator */}
      <div style={{ marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: "rgba(232,232,240,0.5)", fontSize: "0.8rem" }}>Analyzing video…</span>
        </div>
        <div
          style={{
            height: 4,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
          <div className="progress-bar-fill" style={{ width: "65%" }} />
        </div>
      </div>
    </div>
  );
}

function FormatButton({
  label,
  type,
  quality,
  onClick,
}: {
  label: string;
  type: "mp3" | "mp4";
  quality: string;
  onClick: () => void;
}) {
  const isAudio = type === "mp3";
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "0.9rem 1.1rem",
        background: "rgba(255,255,255,0.04)",
        border: "1.5px solid rgba(255,255,255,0.09)",
        borderRadius: 10,
        cursor: "pointer",
        color: "#e8e8f0",
        fontFamily: "var(--font-body)",
        fontSize: "0.9rem",
        fontWeight: 500,
        transition: "border-color 0.15s, background 0.15s",
        marginBottom: 8,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--color-snap-red)";
        el.style.background = "rgba(255,45,85,0.08)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(255,255,255,0.09)";
        el.style.background = "rgba(255,255,255,0.04)";
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "1.1rem" }}>{isAudio ? "🎵" : "📹"}</span>
        <span>{label}</span>
      </span>
      <span
        style={{
          background: isAudio ? "rgba(255,45,85,0.15)" : "rgba(120,40,200,0.15)",
          color: isAudio ? "#ff6b9d" : "#a78bfa",
          borderRadius: 6,
          padding: "2px 10px",
          fontSize: "0.78rem",
          fontWeight: 600,
        }}
      >
        {isAudio ? "MP3" : "MP4"} ↓
      </span>
    </button>
  );
}

export default function ResultView({
  initialUrl,
  cachedInfo,
  onInfoLoaded,
  onBack,
}: ResultViewProps) {
  const [status, setStatus] = useState<Status>(cachedInfo ? "ready" : "loading");
  const [info, setInfo] = useState<VideoInfo | null>(cachedInfo);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (cachedInfo || !initialUrl) return;

    setStatus("loading");
    setErrorMsg("");

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: initialUrl }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to analyze video.");
        return data as VideoInfo;
      })
      .then((data) => {
        setInfo(data);
        onInfoLoaded(data);
        setStatus("ready");
      })
      .catch((err: Error) => {
        setErrorMsg(err.message);
        setStatus("error");
      });
  }, [initialUrl, cachedInfo, onInfoLoaded]);

  // Simulate download (in production, call /api/convert → poll → /api/download/:id)
  const handleDownload = (format: VideoInfo["formats"][number]) => {
    setDownloading(format.label);
    setTimeout(() => {
      setDownloading(null);
      alert(`Download for "${format.label}" would start here.\nIntegrate /api/convert + /api/download/:id.`);
    }, 1500);
  };

  return (
    <section style={{ padding: "3rem 1.25rem 6rem" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(232,232,240,0.5)",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: "1.5rem",
            padding: 0,
            fontFamily: "var(--font-body)",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "#fff")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color =
              "rgba(232,232,240,0.5)")
          }
        >
          ← Convert another video
        </button>

        {status === "loading" && <SkeletonCard />}

        {status === "error" && (
          <div
            className="glass"
            style={{
              borderRadius: 16,
              padding: "2rem",
              textAlign: "center",
              borderColor: "rgba(255,107,107,0.3)",
            }}
          >
            <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>⚠️</span>
            <h2
              className="font-display"
              style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "0.5rem" }}
            >
              Something went wrong
            </h2>
            <p style={{ color: "rgba(232,232,240,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              {errorMsg}
            </p>
            <button className="btn-snap" onClick={onBack} style={{ padding: "0.75rem 1.5rem" }}>
              Try a different link
            </button>
          </div>
        )}

        {status === "ready" && info && (
          <div className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
            {/* Metadata preview */}
            <div style={{ padding: "1.5rem 1.5rem 0" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <img
                  src={info.thumbnail}
                  alt={info.title}
                  style={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                    flexShrink: 0,
                    background: "#1e1e2a",
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <h2
                    className="font-display"
                    style={{
                      color: "#fff",
                      fontSize: "1rem",
                      fontWeight: 700,
                      margin: "0 0 0.3rem",
                      lineHeight: 1.35,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {info.title}
                  </h2>
                  <p style={{ color: "rgba(232,232,240,0.5)", fontSize: "0.82rem", margin: "0 0 0.25rem" }}>
                    {info.uploader}
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 6,
                      padding: "2px 8px",
                      fontSize: "0.78rem",
                      color: "rgba(232,232,240,0.6)",
                    }}
                  >
                    ⏱ {info.duration}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginBottom: "1.25rem" }} />
            </div>

            {/* Format groups */}
            <div style={{ padding: "0 1.5rem 1.5rem" }}>
              {/* MP3 group */}
              {info.formats.filter((f) => f.type === "mp3").length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "rgba(232,232,240,0.35)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    Audio
                  </p>
                  {info.formats
                    .filter((f) => f.type === "mp3")
                    .map((f) => (
                      <FormatButton
                        key={f.label}
                        {...f}
                        onClick={() => handleDownload(f)}
                      />
                    ))}
                </div>
              )}

              {/* MP4 group */}
              {info.formats.filter((f) => f.type === "mp4").length > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "rgba(232,232,240,0.35)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    Video
                  </p>
                  {info.formats
                    .filter((f) => f.type === "mp4")
                    .map((f) => (
                      <FormatButton
                        key={f.label}
                        {...f}
                        onClick={() => handleDownload(f)}
                      />
                    ))}
                </div>
              )}

              {/* Downloading overlay hint */}
              {downloading && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#ff6b9d",
                    fontSize: "0.85rem",
                    marginTop: "0.75rem",
                  }}
                >
                  ⏳ Preparing {downloading}…
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
