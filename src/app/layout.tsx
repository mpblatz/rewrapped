"use client";

import { IBM_Plex_Mono } from "next/font/google";
import { SessionContext, useSessionFetch } from "@/lib/useSession";
import { ThemeProvider } from "@/components/ThemeProvider";
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
        <html lang="en" suppressHydrationWarning className={`${ibmPlexMono.variable} h-full antialiased`}>
            <head>
                <title>Rewrapped</title>
                <meta
                    name="description"
                    content="A minimalist Spotify listening dashboard. See your top songs, artists, playlists, and listening stats."
                />
            </head>
            <body
                className="min-h-full flex flex-col bg-bg text-text"
                style={{ fontFamily: "var(--font-mono), monospace" }}
            >
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="rewrapped-theme">
                    <SessionContext.Provider value={sessionValue}>{children}</SessionContext.Provider>
                </ThemeProvider>
            </body>
        </html>
    );
}
