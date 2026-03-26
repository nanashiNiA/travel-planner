"use client";

import { useEffect } from "react";
import { useChatStore } from "@/stores/chat-store";

interface TripContextSetterProps {
  tripId: string;
}

export function TripContextSetter({ tripId }: TripContextSetterProps) {
  const setActiveTripId = useChatStore((s) => s.setActiveTripId);

  useEffect(() => {
    setActiveTripId(tripId);
    return () => setActiveTripId(null);
  }, [tripId, setActiveTripId]);

  return null;
}
