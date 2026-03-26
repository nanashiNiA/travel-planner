import { create } from "zustand";
import type { TripSummary } from "@/types/trip";

interface TripStore {
  trips: TripSummary[];
  isLoading: boolean;
  setTrips: (trips: TripSummary[]) => void;
  addTrip: (trip: TripSummary) => void;
  removeTrip: (tripId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  isLoading: false,
  setTrips: (trips) => set({ trips }),
  addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),
  removeTrip: (tripId) =>
    set((state) => ({ trips: state.trips.filter((t) => t.id !== tripId) })),
  setLoading: (isLoading) => set({ isLoading }),
}));
