/**
 * analyzeController.ts
 * Validates and sanitizes incoming analyze requests,
 * delegates to ytdlpService, maps error classes to HTTP responses.
 */

import type { Request, Response, NextFunction } from "express";
import {
  getVideoInfo,
  InvalidUrlError,
  VideoUnavailableError,
} from "../services/ytdlpService.js";

// ── YouTube URL validation ────────────────────────────────────────────────────

const YT_PATTERN =
  /^https?:\/\/(www\.|m\.|music\.)?youtube\.com\/(watch\?.*v=|shorts\/|embed\/)|^https?:\/\/youtu\.be\//i;

function sanitizeUrl(raw: unknown): string {
  if (typeof raw !== "string" || raw.trim().length === 0)
    throw new InvalidUrlError("URL is required.");

  const url = raw.trim();

  if (url.length > 2048)
    throw new InvalidUrlError("URL is too long.");

  if (!YT_PATTERN.test(url))
    throw new InvalidUrlError(
      "Only YouTube URLs are supported (youtube.com / youtu.be)."
    );

  // Strip tracking params while preserving video identity
  try {
    const parsed = new URL(url);
    const videoId = parsed.searchParams.get("v");
    if (videoId) {
      const clean = new URL("https://www.youtube.com/watch");
      clean.searchParams.set("v", videoId);
      return clean.toString();
    }
  } catch {
    // fall through with original URL
  }

  return url;
}

// ── Controller ────────────────────────────────────────────────────────────────

/**
 * POST /api/analyze
 * Body: { url: string }
 *
 * Returns VideoInfo JSON or a structured error.
 */
export async function analyzeVideo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let url: string;

  // ── Input validation ─────────────────────────────────────────────────────
  try {
    url = sanitizeUrl(req.body?.url);
  } catch (err) {
    if (err instanceof InvalidUrlError) {
      res.status(400).json({ error: err.message, code: err.code });
      return;
    }
    next(err);
    return;
  }

  // ── Service call ─────────────────────────────────────────────────────────
  try {
    console.log(`[analyze] Fetching info for: ${url}`);
    const info = await getVideoInfo(url);
    console.log(`[analyze] ✓ "${info.title}" – ${info.duration}`);
    res.json(info);
  } catch (err) {
    if (err instanceof InvalidUrlError) {
      res.status(400).json({ error: err.message, code: err.code });
      return;
    }
    if (err instanceof VideoUnavailableError) {
      res.status(422).json({ error: err.message, code: err.code });
      return;
    }
    // Unexpected error → delegate to global handler
    next(err);
  }
}
