"use client";

import { IBM_Plex_Mono } from "next/font/google";
import { SessionContext, useSessionFetch } from "@/lib/useSession";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionValue = useSessionFetch();

  return (
    <html lang="en" className={`${ibmPlexMono.variable} h-full antialiased`}>
      <head>
        <title>Rewrapped — Your Spotify Listening Story</title>
        <meta
          name="description"
          content="A minimalist Spotify listening dashboard. See your top songs, artists, playlists, and listening stats."
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-bg text-text"
        style={{ fontFamily: "var(--font-mono), monospace" }}
      >
        <SessionContext.Provider value={sessionValue}>
          {children}
        </SessionContext.Provider>
      </body>
    </html>
  );
}
