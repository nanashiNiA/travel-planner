"use client";

import { useState, useEffect, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HospitalIcon,
  PillIcon,
  StethoscopeIcon,
  PhoneIcon,
  MapPinIcon,
  NavigationIcon,
  StarIcon,
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
}

type SearchType = "hospital" | "pharmacy" | "doctor";

const SEARCH_TYPES: { type: SearchType; label: string; icon: React.ElementType }[] = [
  { type: "hospital", label: "病院", icon: HospitalIcon },
  { type: "pharmacy", label: "薬局", icon: PillIcon },
  { type: "doctor", label: "クリニック", icon: StethoscopeIcon },
];

export function NearbyHospitalsTab() {
  const [searchType, setSearchType] = useState<SearchType>("hospital");
  const [places, setPlaces] = useState<Place[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("お使いのブラウザは位置情報をサポートしていません");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setError("位置情報の取得が許可されませんでした。ブラウザの設定を確認してください。");
        setLoading(false);
      }
    );
  }, []);

  const searchPlaces = useCallback(
    async (type: SearchType) => {
      if (!coords) return;
      setLoading(true);
      try {
        const res = await fetch("/api/places/nearby", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: coords.lat,
            longitude: coords.lng,
            type,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setPlaces(data.places);
        } else {
          setError("検索に失敗しました");
        }
      } catch {
        setError("通信エラーが発生しました");
      } finally {
        setLoading(false);
      }
    },
    [coords]
  );

  useEffect(() => {
    if (coords) {
      searchPlaces(searchType);
    }
  }, [coords, searchType, searchPlaces]);

  if (!apiKey) {
    return (
      <p className="text-sm text-muted-foreground">
        Google Maps APIキーが設定されていません。
      </p>
    );
  }

  if (error && !coords) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-8">
          <MapPinIcon className="size-8 text-muted-foreground" />
          <p className="text-center text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Type Toggles */}
      <div className="flex gap-2">
        {SEARCH_TYPES.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant={searchType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchType(type)}
            className="gap-1.5"
          >
            <Icon className="size-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Map */}
      {coords && (
        <div className="h-64 overflow-hidden rounded-lg border">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={coords}
              defaultZoom={14}
              mapId="emergency-map"
              gestureHandling="greedy"
              disableDefaultUI
            >
              {/* User location */}
              <AdvancedMarker position={coords} title="現在地" />

              {/* Places */}
              {places.map((place, i) =>
                place.latitude && place.longitude ? (
                  <AdvancedMarker
                    key={i}
                    position={{ lat: place.latitude, lng: place.longitude }}
                    title={place.name}
                  />
                ) : null
              )}
            </Map>
          </APIProvider>
        </div>
      )}

      {/* Results List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {places.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              近くに該当する施設が見つかりませんでした
            </p>
          ) : (
            places.map((place, i) => (
              <Card key={i}>
                <CardContent className="flex items-start gap-3 pt-4">
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
            ))
          )}
        </div>
      )}
    </div>
  );
}
