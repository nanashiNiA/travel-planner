"use client";

import { useState, useCallback } from "react";
import type { DirectionsResponse, TravelMode } from "@/types/directions";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UseDirectionsReturn {
  data: DirectionsResponse | null;
  loading: boolean;
  error: string | null;
  fetchDirections: (
    origin: Coordinates,
    destination: Coordinates,
    mode: TravelMode
  ) => Promise<void>;
  clear: () => void;
}

export function useDirections(): UseDirectionsReturn {
  const [data, setData] = useState<DirectionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDirections = useCallback(
    async (origin: Coordinates, destination: Coordinates, mode: TravelMode) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/routes/directions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origin, destination, mode }),
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          const err = await res.json().catch(() => null);
          setError(err?.error ?? "ルートの取得に失敗しました");
          setData(null);
        }
      } catch {
        setError("通信エラーが発生しました");
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clear = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, fetchDirections, clear };
}
