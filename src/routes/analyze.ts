/**
 * routes/analyze.ts
 * Binds POST /api/analyze with express-rate-limit safeguards.
 */

import { Router } from "express";
import rateLimit from "express-rate-limit";
import { analyzeVideo } from "../controllers/analyzeController.js";

export const analyzeRouter = Router();

// ── Rate limiter ──────────────────────────────────────────────────────────────

const analyzeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,           // 10-minute window
  max: parseInt(process.env.RATE_LIMIT_MAX ?? "5", 10),
  standardHeaders: true,               // Return `RateLimit-*` headers
  legacyHeaders: false,
  keyGenerator: (req) =>
    // Trust Railway's forwarded IP header
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ??
    req.ip ??
    "unknown",
  handler: (_req, res) => {
    res.status(429).json({
      error: "Too many requests – please wait a few minutes before trying again.",
      code: "RATE_LIMITED",
      retryAfterMs: 10 * 60 * 1000,
    });
  },
});

// ── Route binding ─────────────────────────────────────────────────────────────

analyzeRouter.post("/analyze", analyzeLimiter, analyzeVideo);

// Health check (no rate limit needed)
analyzeRouter.get("/analyze/ping", (_req, res) => {
  res.json({ ok: true });
});
