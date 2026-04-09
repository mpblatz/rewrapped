"use client";

import { getTopTracks, type TimeRange, type SpotifyTrack } from "@/lib/spotify";
import { useSpotifyData } from "@/lib/useSpotifyData";
import { ListSkeleton } from "./Skeleton";
import ErrorMessage from "./ErrorMessage";

interface Props {
  accessToken: string;
  timeRange: TimeRange;
  demoData?: SpotifyTrack[];
}

export default function TopSongs({ accessToken, timeRange, demoData }: Props) {
  const { data: fetchedData, loading, error, retry } = useSpotifyData<SpotifyTrack[]>(
    () => getTopTracks(accessToken, timeRange),
    [accessToken, timeRange],
    { skip: !!demoData }
  );

  const data = demoData || fetchedData;

  if (!demoData && loading) return <ListSkeleton count={10} />;
  if (!demoData && error) return <ErrorMessage message={error} onRetry={retry} />;
  if (!data?.length) return <EmptyState />;

  return (
    <div className="space-y-1.5">
      {data.map((track, index) => (
        <a
          key={`${track.id}-${index}`}
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-card-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3.5 group block hover:shadow-[var(--shadow-hover)] hover:border-border-hover transition-all duration-200 animate-in"
          style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
        >
          {/* Rank — top 3 get accent color */}
          <div className="w-6 text-center shrink-0">
            {index < 3 ? (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-[10px] font-bold">
                {index + 1}
              </span>
            ) : (
              <span className="text-[12px] font-semibold text-text-very-faint">
                {index + 1}
              </span>
            )}
          </div>

          {/* Album art */}
          <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-image-bg">
            <img
              src={track.album.images[2]?.url || track.album.images[0]?.url}
              alt={track.album.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
            />
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text text-[13px] truncate leading-tight">
              {track.name}
            </p>
            <p className="text-text-muted text-[11px] truncate mt-0.5">
              {track.artists.map((a) => a.name).join(", ")}
            </p>
          </div>

          {/* Album */}
          <div className="hidden md:block text-right min-w-0 max-w-36">
            <p className="text-text-faint text-[11px] truncate">
              {track.album.name}
            </p>
          </div>

          {/* Duration */}
          <div className="text-text-very-faint text-[11px] tabular-nums shrink-0 hidden sm:block w-10 text-right">
            {formatDuration(track.duration_ms)}
          </div>
        </a>
      ))}
    </div>
  );
}

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function EmptyState() {
  return (
    <div className="bg-card-bg rounded-xl border border-border p-12 text-center">
      <p className="text-text-muted text-sm font-medium">
        No top tracks found for this period
      </p>
      <p className="text-text-faint text-xs mt-1">Try a different time range</p>
    </div>
  );
}
