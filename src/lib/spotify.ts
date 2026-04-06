export type TimeRange = "short_term" | "medium_term" | "long_term";

const SPOTIFY_API = "https://api.spotify.com/v1";

async function spotifyFetch<T>(
  endpoint: string,
  accessToken: string
): Promise<T> {
  const res = await fetch(`${SPOTIFY_API}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error?.error?.message || `Spotify API error: ${res.status}`
    );
  }

  return res.json();
}

// ─── Top Tracks ───────────────────────────────────────────────────

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtistSimple {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtistSimple[];
  album: SpotifyAlbum;
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
}

export async function getTopTracks(
  accessToken: string,
  timeRange: TimeRange = "medium_term",
  limit = 50
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<PaginatedResponse<SpotifyTrack>>(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
  return data.items;
}

// ─── Top Artists ──────────────────────────────────────────────────

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  popularity: number;
  followers: { total: number };
  external_urls: { spotify: string };
}

export async function getTopArtists(
  accessToken: string,
  timeRange: TimeRange = "medium_term",
  limit = 50
): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch<PaginatedResponse<SpotifyArtist>>(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
  return data.items;
}

// ─── Playlists ────────────────────────────────────────────────────

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  tracks: { total: number };
  owner: { display_name: string };
  external_urls: { spotify: string };
}

export async function getPlaylists(
  accessToken: string,
  limit = 50
): Promise<SpotifyPlaylist[]> {
  const data = await spotifyFetch<PaginatedResponse<SpotifyPlaylist>>(
    `/me/playlists?limit=${limit}`,
    accessToken
  );
  return data.items;
}

// ─── Recently Played ──────────────────────────────────────────────

export interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
}

interface RecentlyPlayedResponse {
  items: RecentlyPlayedItem[];
}

export async function getRecentlyPlayed(
  accessToken: string,
  limit = 50
): Promise<RecentlyPlayedItem[]> {
  const data = await spotifyFetch<RecentlyPlayedResponse>(
    `/me/player/recently-played?limit=${limit}`,
    accessToken
  );
  return data.items;
}

// ─── Listening Stats (derived) ────────────────────────────────────

export interface ListeningStatsData {
  topGenres: { genre: string; count: number }[];
  topDecade: string;
  totalArtists: number;
  avgPopularity: number;
  mostActiveHour: string | null;
  totalTracksAnalyzed: number;
  genreBreakdown: { genre: string; percentage: number }[];
  dayOfWeekBreakdown: { day: string; count: number; percentage: number }[] | null;
}

export function deriveListeningStats(
  topArtists: SpotifyArtist[],
  topTracks: SpotifyTrack[],
  recentlyPlayed: RecentlyPlayedItem[]
): ListeningStatsData {
  // Genre analysis from top artists
  const genreCounts: Record<string, number> = {};
  for (const artist of topArtists) {
    for (const genre of artist.genres) {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    }
  }
  const topGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);

  const totalGenreCount = topGenres.reduce((sum, g) => sum + g.count, 0);
  const genreBreakdown = topGenres.slice(0, 8).map((g) => ({
    genre: g.genre,
    percentage: Math.round((g.count / totalGenreCount) * 100),
  }));

  // Decade analysis from top tracks
  const decadeCounts: Record<string, number> = {};
  for (const track of topTracks) {
    if (track.album.release_date) {
      const year = parseInt(track.album.release_date.substring(0, 4));
      const decade = `${Math.floor(year / 10) * 10}s`;
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
    }
  }
  const topDecade =
    Object.entries(decadeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "Unknown";

  // Unique artists
  const uniqueArtistIds = new Set<string>();
  for (const track of topTracks) {
    for (const artist of track.artists) {
      uniqueArtistIds.add(artist.id);
    }
  }
  for (const artist of topArtists) {
    uniqueArtistIds.add(artist.id);
  }

  // Average popularity
  const avgPopularity = topArtists.length
    ? Math.round(
        topArtists.reduce((sum, a) => sum + a.popularity, 0) /
          topArtists.length
      )
    : 0;

  // Most active listening hour from recently played
  let mostActiveHour: string | null = null;
  if (recentlyPlayed.length > 0) {
    const hourCounts: Record<number, number> = {};
    for (const item of recentlyPlayed) {
      const hour = new Date(item.played_at).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
    const peakHour = Object.entries(hourCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    if (peakHour) {
      const h = parseInt(peakHour[0]);
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      mostActiveHour = `${hour12}:00 ${ampm}`;
    }
  }

  // Day of week breakdown from recently played
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dayOfWeekBreakdown: ListeningStatsData["dayOfWeekBreakdown"] = null;
  if (recentlyPlayed.length > 0) {
    const dayCounts = new Array(7).fill(0);
    for (const item of recentlyPlayed) {
      dayCounts[new Date(item.played_at).getDay()]++;
    }
    const maxCount = Math.max(...dayCounts);
    dayOfWeekBreakdown = DAYS.map((day, i) => ({
      day,
      count: dayCounts[i],
      percentage: maxCount > 0 ? Math.round((dayCounts[i] / maxCount) * 100) : 0,
    }));
  }

  return {
    topGenres: topGenres.slice(0, 10),
    topDecade,
    totalArtists: uniqueArtistIds.size,
    avgPopularity,
    mostActiveHour,
    totalTracksAnalyzed: topTracks.length,
    genreBreakdown,
    dayOfWeekBreakdown,
  };
}
