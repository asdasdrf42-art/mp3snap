import * as esbuild from "esbuild";
import { execSync } from "child_process";

// ── Client bundle (JS + React) ───────────────────────────────────────────────
await esbuild.build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ["es2020"],
  outfile: "public/bundle.js",
  jsx: "automatic",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.log("✅  JS bundle → public/bundle.js");

// ── Tailwind CSS (via npx — tailwindcss is in dependencies) ─────────────────
execSync(
  "npx tailwindcss -i src/index.css -o public/style.css --minify",
  { stdio: "inherit" }
);

console.log("✅  CSS bundle → public/style.css");

// ── Server bundle (Node.js) ──────────────────────────────────────────────────
await esbuild.build({
  entryPoints: ["server.ts"],
  bundle: true,
  minify: false,
  platform: "node",
  target: ["node22"],
  outfile: "dist/server.js",
  format: "esm",
  external: [
    "express",
    "cors",
    "helmet",
    "morgan",
    "express-rate-limit",
    "uuid",
    "react",
    "react-dom",
  ],
});

console.log("✅  Server bundle → dist/server.js");
console.log("🎉  Build complete!");
