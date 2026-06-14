/**
 * ytdlpService.ts
 * Fetches video metadata via yt-dlp --dump-json, provides typed format lists,
 * downloads individual streams to temp storage, and schedules auto-cleanup.
 */

import { execFile } from "child_process";
import { promisify } from "util";
import { unlink, access } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const execFileAsync = promisify(execFile);

// ── Config ───────────────────────────────────────────────────────────────────

const YTDLP_BIN = process.env.YTDLP_BIN ?? "yt-dlp";
const TEMP_DIR = process.env.TEMP_DIR ?? "./storage/temp";
const TEMP_TTL_MS = parseInt(process.env.TEMP_TTL_SECONDS ?? "3600", 10) * 1000;
const EXEC_TIMEOUT_MS = 30_000;

// ── Types ─────────────────────────────────────────────────────────────────────

export type FormatType = "mp3" | "mp4";

export interface VideoFormat {
  type: FormatType;
  quality: string;   // e.g. "320" | "192" | "128" | "1080" | "720"
  label: string;     // human-readable: "MP3 320kbps"
  formatId?: string; // raw yt-dlp format id for download
}

export interface VideoInfo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;   // "mm:ss" or "hh:mm:ss"
  uploader: string;
  formats: VideoFormat[];
}

interface RawYtdlpFormat {
  format_id: string;
  ext: string;
  vcodec?: string;
  acodec?: string;
  height?: number;
  abr?: number;
  filesize?: number;
}

interface RawYtdlpInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;   // seconds
  uploader: string;
  formats: RawYtdlpFormat[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function secondsToTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Classify raw yt-dlp formats into our typed VideoFormat list.
 * MP3 options are synthetic (we transcode via ffmpeg) – we just need
 * a valid audio stream format_id to hand off.
 */
function classifyFormats(raw: RawYtdlpFormat[]): VideoFormat[] {
  const formats: VideoFormat[] = [];

  // ── Best audio stream for MP3 transcoding ───────────────────────────────
  const bestAudio = raw
    .filter(
      (f) =>
        f.acodec !== "none" &&
        f.vcodec === "none" &&
        ["webm", "m4a", "mp4"].includes(f.ext)
    )
    .sort((a, b) => (b.abr ?? 0) - (a.abr ?? 0))[0];

  if (bestAudio) {
    for (const q of ["320", "192", "128"] as const) {
      formats.push({
        type: "mp3",
        quality: q,
        label: `MP3 ${q}kbps`,
        formatId: bestAudio.format_id,
      });
    }
  }

  // ── MP4 video streams ────────────────────────────────────────────────────
  const seenHeights = new Set<number>();
  const videoStreams = raw
    .filter(
      (f) =>
        f.vcodec !== "none" &&
        f.height != null &&
        [1080, 720, 480, 360].includes(f.height)
    )
    .sort((a, b) => (b.height ?? 0) - (a.height ?? 0));

  for (const f of videoStreams) {
    if (f.height == null || seenHeights.has(f.height)) continue;
    seenHeights.add(f.height);
    formats.push({
      type: "mp4",
      quality: String(f.height),
      label: `MP4 ${f.height}p`,
      formatId: f.format_id,
    });
  }

  return formats;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch structured video metadata using `yt-dlp --dump-json`.
 * Throws a typed error if the video is unavailable or the URL is invalid.
 */
export async function getVideoInfo(url: string): Promise<VideoInfo> {
  let stdout: string;

  try {
    ({ stdout } = await execFileAsync(
      YTDLP_BIN,
      [
        "--dump-json",
        "--no-playlist",
        "--no-warnings",
        "--user-agent",
        "Mozilla/5.0 (compatible; mp3snap/1.0)",
        url,
      ],
      { timeout: EXEC_TIMEOUT_MS }
    ));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("Private video"))
      throw new VideoUnavailableError("This video is private.");
    if (message.includes("This video is not available"))
      throw new VideoUnavailableError("Video not available in your region.");
    if (message.includes("Unable to extract"))
      throw new InvalidUrlError("Could not extract video info – check the URL.");
    throw new VideoUnavailableError("yt-dlp error: " + message);
  }

  const raw: RawYtdlpInfo = JSON.parse(stdout);

  return {
    videoId: raw.id,
    title: raw.title,
    thumbnail:
      raw.thumbnail ??
      `https://img.youtube.com/vi/${raw.id}/hqdefault.jpg`,
    duration: secondsToTimestamp(raw.duration ?? 0),
    uploader: raw.uploader ?? "Unknown",
    formats: classifyFormats(raw.formats ?? []),
  };
}

/**
 * Download a single format stream to a temp file, returning the file path.
 * Schedules automatic deletion after TEMP_TTL_MS.
 */
export async function downloadStream(
  url: string,
  formatId: string
): Promise<string> {
  const fileName = `${uuidv4()}.%(ext)s`;
  const outputTemplate = path.join(TEMP_DIR, fileName);

  try {
    await execFileAsync(
      YTDLP_BIN,
      [
        "--format",
        formatId,
        "--no-playlist",
        "--no-warnings",
        "--output",
        outputTemplate,
        url,
      ],
      { timeout: 120_000 } // generous timeout for larger files
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new DownloadError("Stream download failed: " + message);
  }

  // yt-dlp resolves the %(ext)s token – locate the actual file
  const resolvedPath = await resolveOutputPath(outputTemplate);

  // Schedule cleanup
  scheduleUnlink(resolvedPath, TEMP_TTL_MS);

  return resolvedPath;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * yt-dlp substitutes %(ext)s in the output template; we need to find the
 * resulting filename by scanning for the uuid prefix.
 */
async function resolveOutputPath(template: string): Promise<string> {
  const base = template.replace(".%(ext)s", "");
  const exts = ["mp4", "webm", "m4a", "mp3", "opus", "ogg"];
  for (const ext of exts) {
    const candidate = `${base}.${ext}`;
    try {
      await access(candidate);
      return candidate;
    } catch {
      // not this extension, keep looking
    }
  }
  throw new DownloadError("Downloaded file not found after yt-dlp completed.");
}

/**
 * Schedule a file for deletion after `delayMs` ms.
 * Silent on failure (file may already be gone).
 */
export function scheduleUnlink(filePath: string, delayMs: number): void {
  setTimeout(async () => {
    try {
      await unlink(filePath);
      console.log(`[ytdlp] 🗑  Cleaned up: ${path.basename(filePath)}`);
    } catch {
      // already deleted or never existed
    }
  }, delayMs);
}

// ── Custom error classes ──────────────────────────────────────────────────────

export class InvalidUrlError extends Error {
  readonly code = "INVALID_URL";
  constructor(message: string) {
    super(message);
    this.name = "InvalidUrlError";
  }
}

export class VideoUnavailableError extends Error {
  readonly code = "VIDEO_UNAVAILABLE";
  constructor(message: string) {
    super(message);
    this.name = "VideoUnavailableError";
  }
}

export class DownloadError extends Error {
  readonly code = "DOWNLOAD_ERROR";
  constructor(message: string) {
    super(message);
    this.name = "DownloadError";
  }
}
