"use client";

import { useState, useEffect, createContext, useContext } from "react";

interface SessionData {
  authenticated: boolean;
  accessToken?: string;
  user?: { name: string; image?: string };
}

interface SessionContextValue {
  session: SessionData | null;
  loading: boolean;
}

export const SessionContext = createContext<SessionContextValue>({
  session: null,
  loading: true,
});

export function useSession() {
  return useContext(SessionContext);
}

export function useSessionFetch(): SessionContextValue {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data))
      .catch(() => setSession({ authenticated: false }))
      .finally(() => setLoading(false));
  }, []);

  return { session, loading };
}
