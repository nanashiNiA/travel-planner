"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DIETARY_OPTIONS } from "@/data/dietary-options";
import {
  SearchIcon,
  PhoneIcon,
  NavigationIcon,
  StarIcon,
  UtensilsIcon,
  MapPinIcon,
} from "lucide-react";

interface Place {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  isOpen?: boolean;
  phone?: string;
  mapsUrl?: string;
  priceLevel?: string;
}

const PRICE_LABELS: Record<string, string> = {
  PRICE_LEVEL_FREE: "無料",
  PRICE_LEVEL_INEXPENSIVE: "¥",
  PRICE_LEVEL_MODERATE: "¥¥",
  PRICE_LEVEL_EXPENSIVE: "¥¥¥",
  PRICE_LEVEL_VERY_EXPENSIVE: "¥¥¥¥",
};

interface RestaurantSearchProps {
  destination: string;
  defaultLatitude?: number;
  defaultLongitude?: number;
}

export function RestaurantSearch({
  destination,
  defaultLatitude,
  defaultLongitude,
}: RestaurantSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    defaultLatitude && defaultLongitude
      ? { lat: defaultLatitude, lng: defaultLongitude }
      : null
  );

  // Get geolocation if no default coords
  useEffect(() => {
    if (coords) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {} // Silently fail — user can still search by text
    );
  }, [coords]);

  const search = useCallback(
    async (searchQuery: string) => {
      if (!coords) return;
      setLoading(true);

      try {
        const res = await fetch("/api/places/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            latitude: coords.lat,
            longitude: coords.lng,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setPlaces(data.places);
        }
      } finally {
        setLoading(false);
      }
    },
    [coords]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const searchText = query.trim() || `${destination} レストラン`;
    search(searchText);
  }

  function handleDietaryFilter(dietaryId: string) {
    const option = DIETARY_OPTIONS.find((o) => o.id === dietaryId);
    if (!option) return;

    if (selectedDietary === dietaryId) {
      setSelectedDietary(null);
      search(`${destination} レストラン`);
    } else {
      setSelectedDietary(dietaryId);
      search(`${destination} ${option.searchKeyword}`);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`${destination}のレストランを検索...`}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !coords}>
          <SearchIcon className="size-4" />
        </Button>
      </form>

      {/* Dietary Filters */}
      <div className="flex flex-wrap gap-2">
        {DIETARY_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleDietaryFilter(option.id)}
          >
            <Badge
              variant={selectedDietary === option.id ? "default" : "outline"}
              className="cursor-pointer"
            >
              {option.label}
            </Badge>
          </button>
        ))}
      </div>

      {!coords && (
        <p className="text-sm text-muted-foreground">
          <MapPinIcon className="mr-1 inline size-4" />
          位置情報を許可するとより正確な結果が表示されます
        </p>
      )}

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : places.length > 0 ? (
        <div className="space-y-3">
          {places.map((place, i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-3 pt-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-800">
                  <UtensilsIcon className="size-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{place.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {place.address}
                  </p>
                  <div className="flex items-center gap-2">
                    {place.rating && (
                      <span className="inline-flex items-center gap-0.5 text-xs">
                        <StarIcon className="size-3 fill-yellow-400 text-yellow-400" />
                        {place.rating}
                      </span>
                    )}
                    {place.priceLevel && PRICE_LABELS[place.priceLevel] && (
                      <span className="text-xs text-muted-foreground">
                        {PRICE_LABELS[place.priceLevel]}
                      </span>
                    )}
                    {place.isOpen !== undefined && (
                      <Badge
                        variant={place.isOpen ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {place.isOpen ? "営業中" : "営業時間外"}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
                    >
                      <PhoneIcon className="size-3" />
                      電話
                    </a>
                  )}
                  {place.mapsUrl && (
                    <a
                      href={place.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs"
                    >
                      <NavigationIcon className="size-3" />
                      地図
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <UtensilsIcon className="mx-auto mb-2 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            上の検索バーやフィルターで
            <br />
            レストランを検索してください
          </p>
        </div>
      )}
    </div>
  );
}
