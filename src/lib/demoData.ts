import type {
  SpotifyTrack,
  SpotifyArtist,
  SpotifyPlaylist,
  RecentlyPlayedItem,
  ListeningStatsData,
} from "./spotify";

const img = (seed: string) => [
  { url: `https://picsum.photos/seed/${seed}/300/300`, height: 300, width: 300 },
  { url: `https://picsum.photos/seed/${seed}/160/160`, height: 160, width: 160 },
  { url: `https://picsum.photos/seed/${seed}/64/64`, height: 64, width: 64 },
];

export const DEMO_TRACKS: SpotifyTrack[] = [
  { id: "t1", name: "Nights", artists: [{ id: "a1", name: "Frank Ocean" }], album: { id: "al1", name: "Blonde", images: img("blonde"), release_date: "2016-08-20" }, duration_ms: 304000, preview_url: null, external_urls: { spotify: "#" } },
  { id: "t2", name: "Motion Sickness", artists: [{ id: "a2", name: "Phoebe Bridgers" }], album: { id: "al2", name: "Stranger in the Alps", images: img("stranger"), release_date: "2017-09-22" }, duration_ms: 233000, preview_url: null, external_urls: { spotify: "#" } },
  { id: "t3", name: "Redbone", artists: [{ id: "a3", name: "Childish Gambino" }], album: { id: "al3", name: "Awaken, My Love!", images: img("awaken"), release_date: "2016-12-02" }, duration_ms: 327000, preview_url: null, external_urls: { spotify: "#" } },
  { id: "t4", name: "Pink + White", artists: [{ id: "a1", name: "Frank Ocean" }], album: { id: "al1", name: "Blonde", images: img("blonde2"), release_date: "2016-08-20" }, duration_ms: 181000, preview_url: null, external_urls: { spotify: "#" } },
  { id: "t5", name: "505", artists: [{ id: "a4", name: "Arctic Monkeys" }], album: { id: "al4", name: "Favourite Worst Nightmare", images: img("fwn"), release_date: "2007-04-23" }, duration_ms: 254000, preview_url: null, external_urls: { spotify: "#" } },
  { id: "t6", name: "Kyoto", artists: [{ id: "a2", name: "Phoebe Bridgers" }], album: { id: "al5", name: "Punisher", images: img("punisher"), release_date: "2020-06-18" }, duration_ms: 214000, preview_url: null, external_urls: { spotify: "#" } },
  { id: "t7", name: "Ivy", artists: [{ id: "a1", name: "Frank Ocean" }], album: { id: "al1", name: "Blonde", images: img("blonde3"), release_date: "2016-08-20" }, duration_ms: 249000, preview_url: null, external_urls: { spotify: "#" } },
  { id: "t8", name: "Do I Wanna Know?", artists: [{ id: "a4", name: "Arctic Monkeys" }], album: { id: "al6", name: "AM", images: img("am"), release_date: "2013-09-09" }, duration_ms: 272000, preview_url: null, external_urls: { spotify: "#" } },
  { id: "t9", name: "Electric Feel", artists: [{ id: "a5", name: "MGMT" }], album: { id: "al7", name: "Oracular Spectacular", images: img("oracular"), release_date: "2007-10-02" }, duration_ms: 229000, preview_url: null, external_urls: { spotify: "#" } },
  { id: "t10", name: "Let It Happen", artists: [{ id: "a6", name: "Tame Impala" }], album: { id: "al8", name: "Currents", images: img("currents"), release_date: "2015-07-17" }, duration_ms: 468000, preview_url: null, external_urls: { spotify: "#" } },
];

export const DEMO_ARTISTS: SpotifyArtist[] = [
  { id: "a1", name: "Frank Ocean", images: img("frankocean"), genres: ["alternative r&b", "neo soul"], popularity: 87, followers: { total: 12000000 }, external_urls: { spotify: "#" } },
  { id: "a2", name: "Phoebe Bridgers", images: img("phoebe"), genres: ["indie rock", "indie pop"], popularity: 78, followers: { total: 4200000 }, external_urls: { spotify: "#" } },
  { id: "a4", name: "Arctic Monkeys", images: img("arcticmonkeys"), genres: ["indie rock", "garage rock"], popularity: 84, followers: { total: 18000000 }, external_urls: { spotify: "#" } },
  { id: "a6", name: "Tame Impala", images: img("tameimpala"), genres: ["psychedelic pop", "indie rock"], popularity: 80, followers: { total: 9000000 }, external_urls: { spotify: "#" } },
  { id: "a3", name: "Childish Gambino", images: img("gambino"), genres: ["hip hop", "alternative r&b"], popularity: 82, followers: { total: 14000000 }, external_urls: { spotify: "#" } },
  { id: "a5", name: "MGMT", images: img("mgmt"), genres: ["psychedelic pop", "indie pop"], popularity: 72, followers: { total: 5500000 }, external_urls: { spotify: "#" } },
  { id: "a7", name: "Radiohead", images: img("radiohead"), genres: ["art rock", "alternative rock"], popularity: 79, followers: { total: 11000000 }, external_urls: { spotify: "#" } },
  { id: "a8", name: "Steve Lacy", images: img("stevelacy"), genres: ["alternative r&b", "indie pop"], popularity: 83, followers: { total: 8000000 }, external_urls: { spotify: "#" } },
];

export const DEMO_PLAYLISTS: SpotifyPlaylist[] = [
  { id: "p1", name: "Late Night Drives", description: null, images: img("playlist1"), tracks: { total: 47 }, owner: { display_name: "Demo User" }, external_urls: { spotify: "#" } },
  { id: "p2", name: "Morning Coffee", description: null, images: img("playlist2"), tracks: { total: 32 }, owner: { display_name: "Demo User" }, external_urls: { spotify: "#" } },
  { id: "p3", name: "Indie Essentials", description: null, images: img("playlist3"), tracks: { total: 85 }, owner: { display_name: "Demo User" }, external_urls: { spotify: "#" } },
  { id: "p4", name: "Chill Vibes", description: null, images: img("playlist4"), tracks: { total: 63 }, owner: { display_name: "Spotify" }, external_urls: { spotify: "#" } },
  { id: "p5", name: "Workout Mix", description: null, images: img("playlist5"), tracks: { total: 28 }, owner: { display_name: "Demo User" }, external_urls: { spotify: "#" } },
  { id: "p6", name: "Throwbacks", description: null, images: img("playlist6"), tracks: { total: 112 }, owner: { display_name: "Demo User" }, external_urls: { spotify: "#" } },
];

function recentTime(hoursAgo: number): string {
  return new Date(Date.now() - hoursAgo * 3600000).toISOString();
}

export const DEMO_RECENT: RecentlyPlayedItem[] = [
  { track: DEMO_TRACKS[0], played_at: recentTime(0.5) },
  { track: DEMO_TRACKS[3], played_at: recentTime(1) },
  { track: DEMO_TRACKS[9], played_at: recentTime(1.5) },
  { track: DEMO_TRACKS[2], played_at: recentTime(3) },
  { track: DEMO_TRACKS[5], played_at: recentTime(5) },
  { track: DEMO_TRACKS[7], played_at: recentTime(8) },
  { track: DEMO_TRACKS[1], played_at: recentTime(26) },
  { track: DEMO_TRACKS[4], played_at: recentTime(27) },
  { track: DEMO_TRACKS[8], played_at: recentTime(28) },
  { track: DEMO_TRACKS[6], played_at: recentTime(50) },
];

export const DEMO_STATS: ListeningStatsData = {
  topGenres: [
    { genre: "indie rock", count: 14 },
    { genre: "alternative r&b", count: 11 },
    { genre: "psychedelic pop", count: 8 },
    { genre: "indie pop", count: 7 },
    { genre: "neo soul", count: 5 },
    { genre: "hip hop", count: 4 },
    { genre: "garage rock", count: 3 },
    { genre: "art rock", count: 3 },
    { genre: "alternative rock", count: 2 },
    { genre: "dream pop", count: 1 },
  ],
  topDecade: "2010s",
  totalArtists: 38,
  avgPopularity: 68,
  mostActiveHour: "10:00 PM",
  totalTracksAnalyzed: 50,
  genreBreakdown: [
    { genre: "indie rock", percentage: 24 },
    { genre: "alternative r&b", percentage: 19 },
    { genre: "psychedelic pop", percentage: 14 },
    { genre: "indie pop", percentage: 12 },
    { genre: "neo soul", percentage: 9 },
    { genre: "hip hop", percentage: 7 },
    { genre: "garage rock", percentage: 5 },
    { genre: "art rock", percentage: 5 },
  ],
  dayOfWeekBreakdown: [
    { day: "Sun", count: 8, percentage: 80 },
    { day: "Mon", count: 5, percentage: 50 },
    { day: "Tue", count: 6, percentage: 60 },
    { day: "Wed", count: 10, percentage: 100 },
    { day: "Thu", count: 7, percentage: 70 },
    { day: "Fri", count: 9, percentage: 90 },
    { day: "Sat", count: 6, percentage: 60 },
  ],
};
