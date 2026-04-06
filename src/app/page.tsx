"use client";

import { useSession } from "@/lib/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.authenticated) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (loading || session?.authenticated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-text-faint text-xs">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-5">
      <div className="text-center max-w-sm animate-in">
        {/* Logo mark */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent text-white mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text mb-2">
          Rewrapped
        </h1>
        <p className="text-text-muted text-[13px] leading-relaxed mb-8">
          See your top songs, artists, and listening habits — pulled live from Spotify.
        </p>

        <a
          href="/api/auth/login"
          className="inline-flex items-center gap-2.5 bg-accent text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-link-hover transition-colors duration-200"
        >
          <SpotifyIcon />
          Connect with Spotify
        </a>

        <p className="text-text-very-faint text-[10px] mt-6">
          Read-only access &middot; Nothing stored
        </p>
      </div>
    </main>
  );
}

function SpotifyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
