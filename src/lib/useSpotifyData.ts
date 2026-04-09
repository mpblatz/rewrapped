import { useState, useEffect, useCallback } from "react";

export function useSpotifyData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options?: { skip?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (options?.skip) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, options?.skip]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, retry: load };
}
