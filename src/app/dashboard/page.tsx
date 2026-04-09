"use client";

import { useSession } from "@/lib/useSession";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import type { TimeRange } from "@/lib/spotify";
import { Sun, Moon } from "lucide-react";
import TopSongs from "@/components/TopSongs";
import TopArtists from "@/components/TopArtists";
import Playlists from "@/components/Playlists";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import ListeningStats from "@/components/ListeningStats";
import {
  DEMO_TRACKS,
  DEMO_ARTISTS,
  DEMO_PLAYLISTS,
  DEMO_RECENT,
  DEMO_STATS,
} from "@/lib/demoData";

const TABS = [
  { id: "songs", label: "Top Songs" },
  { id: "artists", label: "Top Artists" },
  { id: "playlists", label: "Playlists" },
  { id: "recent", label: "Recent" },
  { id: "stats", label: "Stats" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "short_term", label: "4 Weeks" },
  { value: "medium_term", label: "6 Months" },
  { value: "long_term", label: "All Time" },
];

function SpotifyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function DashboardPage() {
  const { session, loading } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("songs");
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
  const [demoMode, setDemoMode] = useState(false);

  const isActive = (t: string) => mounted && theme === t;

  useEffect(() => setMounted(true), []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-text-faint text-xs">Loading...</div>
      </div>
    );
  }

  const authenticated = session?.authenticated;
  const hasData = authenticated || demoMode;
  const showTimeRange = activeTab !== "playlists";
  const accessToken = session?.accessToken ?? "";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-divider" style={{ backgroundColor: "var(--header-bg)" }}>
        <div className="max-w-4xl mx-auto px-5 h-12 flex items-center justify-between">
          <span className="text-[28px] font-bold tracking-[-0.03em]">Rewrapped</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-md p-[3px]" style={{ background: "var(--toggle-bg)" }}>
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center justify-center w-[30px] h-[26px] rounded-[6px] transition-all duration-150 ${
                  isActive("light") ? "shadow-toggle" : ""
                }`}
                style={isActive("light") ? { background: "var(--toggle-active)" } : {}}
                aria-label="Light mode"
              >
                <Sun className="h-3.5 w-3.5 text-text-muted" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center justify-center w-[30px] h-[26px] rounded-[6px] transition-all duration-150 ${
                  isActive("dark") ? "shadow-toggle" : ""
                }`}
                style={isActive("dark") ? { background: "var(--toggle-active)" } : {}}
                aria-label="Dark mode"
              >
                <Moon className="h-3.5 w-3.5 text-text-muted" />
              </button>
            </div>
            {authenticated ? (
              <>
                <span className="text-[11px] font-mono text-text-faint tracking-[0.02em] hidden sm:inline">
                  {session.user?.name}
                </span>
                <a
                  href="/api/auth/logout"
                  className="text-[11px] text-text-muted hover:text-accent transition-colors duration-200"
                >
                  Sign out
                </a>
              </>
            ) : (
              <a
                href="/api/auth/login"
                className="inline-flex items-center gap-1.5 text-[11px] text-text-muted hover:text-accent transition-colors duration-200"
              >
                <SpotifyIcon />
                Connect Spotify
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Tabs + Time Range in one bar */}
      <div className="sticky top-12 z-40 backdrop-blur-md border-b border-divider" style={{ backgroundColor: "var(--header-bg)" }}>
        <div className="max-w-4xl mx-auto px-5 h-11 flex items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex gap-0.5 bg-btn-bg rounded-lg p-0.5 border border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-card-bg text-text shadow-sm border border-border"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Time range */}
          {showTimeRange && (
            <div className="flex gap-0.5 bg-btn-bg rounded-lg p-0.5 border border-border shrink-0">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                    timeRange === range.value
                      ? "bg-card-bg text-text shadow-sm border border-border"
                      : "text-text-faint hover:text-text"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-5">
        {hasData ? (
          <>
            {demoMode && (
              <div className="mb-4 bg-accent-bg border border-border rounded-xl px-4 py-2.5 flex items-center justify-between animate-in">
                <p className="text-[11px] text-text-muted">
                  Viewing demo data &middot;{" "}
                  <a href="/api/auth/login" className="text-accent hover:underline">
                    Connect Spotify
                  </a>{" "}
                  for your own stats
                </p>
                <button
                  onClick={() => setDemoMode(false)}
                  className="text-[11px] text-text-faint hover:text-text transition-colors cursor-pointer"
                >
                  Exit demo
                </button>
              </div>
            )}
            {activeTab === "songs" && (
              <TopSongs accessToken={accessToken} timeRange={timeRange} demoData={demoMode ? DEMO_TRACKS : undefined} />
            )}
            {activeTab === "artists" && (
              <TopArtists accessToken={accessToken} timeRange={timeRange} demoData={demoMode ? DEMO_ARTISTS : undefined} />
            )}
            {activeTab === "playlists" && (
              <Playlists accessToken={accessToken} demoData={demoMode ? DEMO_PLAYLISTS : undefined} />
            )}
            {activeTab === "recent" && (
              <RecentlyPlayed accessToken={accessToken} timeRange={timeRange} demoData={demoMode ? DEMO_RECENT : undefined} />
            )}
            {activeTab === "stats" && (
              <ListeningStats accessToken={accessToken} timeRange={timeRange} demoData={demoMode ? DEMO_STATS : undefined} />
            )}
          </>
        ) : (
          <div className="text-center py-20 animate-in">
            <p className="text-text-muted text-[13px] leading-relaxed mb-6">
              Connect your Spotify account to see your listening data, or try the demo to explore.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="/api/auth/login"
                className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl font-semibold text-[12px] hover:bg-accent-light transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Connect Spotify
              </a>
              <button
                onClick={() => setDemoMode(true)}
                className="px-5 py-2.5 rounded-xl font-semibold text-[12px] text-text-muted border border-border hover:border-border-hover hover:text-text transition-all duration-200 cursor-pointer"
              >
                Try demo data
              </button>
            </div>
            <p className="text-text-very-faint text-[10px] mt-6">
              Read-only access &middot; Nothing stored
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-divider py-4">
        <div className="max-w-4xl mx-auto px-5 text-[10px] text-text-very-faint">
          Data from Spotify
        </div>
      </footer>
    </div>
  );
}
