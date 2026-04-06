"use client";

import {
  getTopArtists,
  getTopTracks,
  getRecentlyPlayed,
  deriveListeningStats,
  type TimeRange,
  type ListeningStatsData,
} from "@/lib/spotify";
import { useSpotifyData } from "@/lib/useSpotifyData";
import { StatsGridSkeleton } from "./Skeleton";
import ErrorMessage from "./ErrorMessage";

interface Props {
  accessToken: string;
  timeRange: TimeRange;
}

export default function ListeningStats({ accessToken, timeRange }: Props) {
  const { data, loading, error, retry } = useSpotifyData<ListeningStatsData>(
    async () => {
      const [artists, tracks, recent] = await Promise.all([
        getTopArtists(accessToken, timeRange),
        getTopTracks(accessToken, timeRange),
        getRecentlyPlayed(accessToken),
      ]);
      return deriveListeningStats(artists, tracks, recent);
    },
    [accessToken, timeRange]
  );

  if (loading) return <StatsGridSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Highlight card */}
      {data.topGenres[0] && (
        <div className="bg-accent rounded-xl p-5 text-white animate-in">
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-1">
            Your top genre
          </p>
          <p className="text-2xl font-bold capitalize leading-tight">
            {data.topGenres[0].genre}
          </p>
          <p className="text-[11px] opacity-60 mt-1">
            Across {data.topGenres.length} genres discovered
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          label="Top Decade"
          value={data.topDecade}
          detail="most-played era"
          delay={40}
        />
        <StatCard
          label="Artists"
          value={data.totalArtists.toString()}
          detail="unique artists"
          delay={80}
        />
        <StatCard
          label="Popularity"
          value={`${data.avgPopularity}`}
          detail={
            data.avgPopularity > 70
              ? "mainstream listener"
              : data.avgPopularity > 40
                ? "balanced taste"
                : "deep cuts collector"
          }
          delay={120}
        />
        {data.mostActiveHour && (
          <StatCard
            label="Peak Hour"
            value={data.mostActiveHour}
            detail="most active time"
            delay={160}
          />
        )}
        <StatCard
          label="Tracks"
          value={data.totalTracksAnalyzed.toString()}
          detail="analyzed"
          delay={200}
        />
      </div>

      {/* Genre breakdown */}
      {data.genreBreakdown.length > 0 && (
        <div className="bg-card-bg rounded-xl border border-border p-5 animate-in" style={{ animationDelay: "240ms" }}>
          <h3 className="text-[12px] font-bold text-text mb-4">
            Genre breakdown
          </h3>
          <div className="space-y-2.5">
            {data.genreBreakdown.map((genre) => (
              <div key={genre.genre} className="flex items-center gap-3">
                <span className="text-[11px] text-text capitalize w-28 truncate shrink-0">
                  {genre.genre}
                </span>
                <div className="flex-1 h-2 bg-accent-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                    style={{ width: `${genre.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-text-faint tabular-nums w-8 text-right shrink-0">
                  {genre.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Genre cloud */}
      {data.topGenres.length > 0 && (
        <div className="bg-card-bg rounded-xl border border-border p-5 animate-in" style={{ animationDelay: "320ms" }}>
          <h3 className="text-[12px] font-bold text-text mb-3">
            All genres
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {data.topGenres.map((g, i) => (
              <span
                key={g.genre}
                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium capitalize ${
                  i === 0
                    ? "bg-accent text-white"
                    : i < 3
                      ? "bg-accent-lighter text-accent"
                      : "bg-accent-bg text-text-muted"
                }`}
              >
                {g.genre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  delay = 0,
}: {
  label: string;
  value: string;
  detail: string;
  delay?: number;
}) {
  return (
    <div
      className="bg-card-bg rounded-xl border border-border p-4 animate-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-[10px] font-semibold text-text-faint uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-lg font-bold text-text capitalize leading-tight">
        {value}
      </p>
      <p className="text-text-very-faint text-[10px] mt-0.5">{detail}</p>
    </div>
  );
}
