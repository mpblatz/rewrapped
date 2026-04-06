"use client";

import { useSession } from "@/lib/useSession";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { TimeRange } from "@/lib/spotify";
import TopSongs from "@/components/TopSongs";
import TopArtists from "@/components/TopArtists";
import Playlists from "@/components/Playlists";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import ListeningStats from "@/components/ListeningStats";

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

export default function DashboardPage() {
  const { session, loading } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("songs");
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");

  useEffect(() => {
    if (!loading && !session?.authenticated) {
      router.push("/");
    }
  }, [loading, session, router]);

  if (loading || !session?.authenticated) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-text-faint text-xs">Loading...</div>
      </div>
    );
  }

  const showTimeRange = activeTab !== "playlists";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-divider">
        <div className="max-w-4xl mx-auto px-5 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight">Rewrapped</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-text-faint hidden sm:inline">
              {session.user?.name}
            </span>
            <a
              href="/api/auth/logout"
              className="text-[11px] text-text-very-faint hover:text-accent transition-colors duration-200"
            >
              Sign out
            </a>
          </div>
        </div>
      </header>

      {/* Tabs + Time Range in one bar */}
      <div className="sticky top-12 z-40 bg-bg/80 backdrop-blur-md border-b border-divider">
        <div className="max-w-4xl mx-auto px-5 h-11 flex items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex gap-0.5 bg-btn-bg rounded-lg p-0.5 border border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-accent text-white shadow-sm"
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
        {activeTab === "songs" && (
          <TopSongs accessToken={session.accessToken!} timeRange={timeRange} />
        )}
        {activeTab === "artists" && (
          <TopArtists accessToken={session.accessToken!} timeRange={timeRange} />
        )}
        {activeTab === "playlists" && (
          <Playlists accessToken={session.accessToken!} />
        )}
        {activeTab === "recent" && (
          <RecentlyPlayed accessToken={session.accessToken!} timeRange={timeRange} />
        )}
        {activeTab === "stats" && (
          <ListeningStats accessToken={session.accessToken!} timeRange={timeRange} />
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
