"use client";

import { getRecentlyPlayed, type RecentlyPlayedItem, type TimeRange } from "@/lib/spotify";
import { useSpotifyData } from "@/lib/useSpotifyData";
import { ListSkeleton } from "./Skeleton";
import ErrorMessage from "./ErrorMessage";

interface Props {
  accessToken: string;
  timeRange: TimeRange;
}

export default function RecentlyPlayed({ accessToken }: Props) {
  const { data, loading, error, retry } = useSpotifyData<RecentlyPlayedItem[]>(
    () => getRecentlyPlayed(accessToken),
    [accessToken]
  );

  if (loading) return <ListSkeleton count={10} />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;
  if (!data?.length) return <EmptyState />;

  // Group by relative day
  const groups = groupByDay(data);

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.label} className="animate-in">
          <p className="text-[10px] font-semibold text-text-faint uppercase tracking-wider mb-2 px-1">
            {group.label}
          </p>
          <div className="space-y-1.5">
            {group.items.map((item, index) => (
              <a
                key={`${item.track.id}-${item.played_at}`}
                href={item.track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3.5 group block hover:shadow-[var(--shadow-hover)] hover:border-border-hover transition-all duration-200"
              >
                {/* Time */}
                <div className="w-12 shrink-0 text-right">
                  <p className="text-text-faint text-[11px] tabular-nums">
                    {formatTime(item.played_at)}
                  </p>
                </div>

                {/* Album art */}
                <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden bg-image-bg">
                  <img
                    src={item.track.album.images[2]?.url || item.track.album.images[0]?.url}
                    alt={item.track.album.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                  />
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text text-[13px] truncate leading-tight">
                    {item.track.name}
                  </p>
                  <p className="text-text-muted text-[11px] truncate mt-0.5">
                    {item.track.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      <p className="text-center text-text-very-faint text-[10px] pt-1">
        Showing last {data.length} tracks
      </p>
    </div>
  );
}

interface DayGroup {
  label: string;
  items: RecentlyPlayedItem[];
}

function groupByDay(items: RecentlyPlayedItem[]): DayGroup[] {
  const groups: DayGroup[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  for (const item of items) {
    const date = new Date(item.played_at);
    const itemDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let label: string;
    if (itemDay.getTime() === today.getTime()) {
      label = "Today";
    } else if (itemDay.getTime() === yesterday.getTime()) {
      label = "Yesterday";
    } else {
      label = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }

    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.label === label) {
      lastGroup.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }

  return groups;
}

function formatTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
}

function EmptyState() {
  return (
    <div className="bg-card-bg rounded-xl border border-border p-12 text-center">
      <p className="text-text-muted text-sm font-medium">No recently played tracks</p>
      <p className="text-text-faint text-xs mt-1">Go listen to some music!</p>
    </div>
  );
}
