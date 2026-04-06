"use client";

import { getTopArtists, type TimeRange, type SpotifyArtist } from "@/lib/spotify";
import { useSpotifyData } from "@/lib/useSpotifyData";
import { GridSkeleton } from "./Skeleton";
import ErrorMessage from "./ErrorMessage";

interface Props {
  accessToken: string;
  timeRange: TimeRange;
}

export default function TopArtists({ accessToken, timeRange }: Props) {
  const { data, loading, error, retry } = useSpotifyData<SpotifyArtist[]>(
    () => getTopArtists(accessToken, timeRange),
    [accessToken, timeRange]
  );

  if (loading) return <GridSkeleton count={12} />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;
  if (!data?.length) return <EmptyState />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {data.map((artist, index) => (
        <a
          key={artist.id}
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-card-bg rounded-xl border border-border p-3.5 group block hover:shadow-[var(--shadow-hover)] hover:border-border-hover transition-all duration-200 animate-in"
          style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
        >
          <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-image-bg">
            {artist.images[1]?.url || artist.images[0]?.url ? (
              <img
                src={artist.images[1]?.url || artist.images[0]?.url}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-faint text-xl font-bold">
                {artist.name[0]}
              </div>
            )}
            {/* Rank badge */}
            <div className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm ${
              index < 3
                ? "bg-accent/90 text-white"
                : "bg-card-bg/80 text-text-muted"
            }`}>
              {index + 1}
            </div>
          </div>

          <p className="font-semibold text-text text-[12px] truncate leading-tight">
            {artist.name}
          </p>
          <p className="text-text-faint text-[10px] truncate mt-0.5">
            {artist.genres.slice(0, 2).join(", ") || "No genres listed"}
          </p>
        </a>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-card-bg rounded-xl border border-border p-12 text-center">
      <p className="text-text-muted text-sm font-medium">
        No top artists found for this period
      </p>
      <p className="text-text-faint text-xs mt-1">Try a different time range</p>
    </div>
  );
}
