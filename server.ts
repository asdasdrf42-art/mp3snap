/**
 * server.ts – MP3Snap Express entry point
 * Orchestrates: middleware stack → API routes → static SPA fallback
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { analyzeRouter } from "./src/routes/analyze.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = parseInt(process.env.PORT ?? "3000", 10);

// ── Security & utility middlewares ───────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://i.ytimg.com", "https://img.youtube.com"],
        connectSrc: ["'self'"],
      },
    },
  })
);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? "*",
    methods: ["GET", "POST"],
  })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api", analyzeRouter);

// ── Health probe (Railway / Docker) ─────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ── Static assets & SPA fallback ────────────────────────────────────────────
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir, { maxAge: "1d" }));

// For every unmatched route, serve the SPA shell so the client router takes over
app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[server]", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`🎵  MP3Snap running → http://localhost:${PORT}`);
});

export default app;
