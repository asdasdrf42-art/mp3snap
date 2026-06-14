/**
 * App.tsx
 * Main state distributor + zero-dependency client-side URL router.
 * Routes: "/" → Home | "/result" → ResultView
 */

import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header.js";
import Hero from "./components/Hero.js";
import Features from "./components/Features.js";
import FAQ from "./components/FAQ.js";
import Footer from "./components/Footer.js";
import ResultView from "./components/ResultView.js";

export type Page = "home" | "result";

export interface VideoInfo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  uploader: string;
  formats: Array<{
    type: "mp3" | "mp4";
    quality: string;
    label: string;
    formatId?: string;
  }>;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [pendingUrl, setPendingUrl] = useState<string>("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  // ── Sync router with browser history ──────────────────────────────────────
  useEffect(() => {
    const syncRoute = () => {
      const path = window.location.pathname;
      if (path === "/result") setPage("result");
      else setPage("home");
    };
    syncRoute();
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const navigate = useCallback((target: Page, url?: string) => {
    const path = target === "result" ? "/result" : "/";
    window.history.pushState({}, "", path);
    if (url) setPendingUrl(url);
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goHome = useCallback(() => {
    setVideoInfo(null);
    setPendingUrl("");
    navigate("home");
  }, [navigate]);

  return (
    <div className={`mesh-bg min-h-screen ${darkMode ? "dark" : ""}`}>
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} onLogoClick={goHome} />

      {page === "home" && (
        <>
          <Hero onConvert={(url) => navigate("result", url)} />
          <Features />
          <FAQ />
        </>
      )}

      {page === "result" && (
        <ResultView
          initialUrl={pendingUrl}
          cachedInfo={videoInfo}
          onInfoLoaded={setVideoInfo}
          onBack={goHome}
        />
      )}

      <Footer />
    </div>
  );
}
