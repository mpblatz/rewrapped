"use client";

import { getPlaylists, type SpotifyPlaylist } from "@/lib/spotify";
import { useSpotifyData } from "@/lib/useSpotifyData";
import { GridSkeleton } from "./Skeleton";
import ErrorMessage from "./ErrorMessage";

interface Props {
  accessToken: string;
  demoData?: SpotifyPlaylist[];
}

export default function Playlists({ accessToken, demoData }: Props) {
  const { data: fetchedData, loading, error, retry } = useSpotifyData<SpotifyPlaylist[]>(
    () => getPlaylists(accessToken),
    [accessToken],
    { skip: !!demoData }
  );

  const data = demoData || fetchedData;

  if (!demoData && loading) return <GridSkeleton count={9} />;
  if (!demoData && error) return <ErrorMessage message={error} onRetry={retry} />;
  if (!data?.length) return <EmptyState />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {data.map((playlist, index) => (
        <a
          key={playlist.id}
          href={playlist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-card-bg rounded-xl border border-border p-3.5 group block hover:shadow-[var(--shadow-hover)] hover:border-border-hover transition-all duration-200 animate-in"
          style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
        >
          <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-image-bg">
            {playlist.images[0]?.url ? (
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-faint">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
            )}
            <div className="absolute bottom-1.5 right-1.5 bg-card-bg/90 backdrop-blur-sm text-[10px] font-semibold text-text-muted px-1.5 py-0.5 rounded-md">
              {playlist.tracks.total} tracks
            </div>
          </div>

          <p className="font-semibold text-text text-[12px] truncate leading-tight">
            {playlist.name}
          </p>
          <p className="text-text-faint text-[10px] truncate mt-0.5">
            {playlist.owner.display_name}
          </p>
        </a>
      ))}
    </div>
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

function EmptyState() {
  return (
    <div className="bg-card-bg rounded-xl border border-border p-12 text-center">
      <p className="text-text-muted text-sm font-medium">No playlists found</p>
    </div>
  );
}
