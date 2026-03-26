"use client";

import { useEffect, useRef, useMemo } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { decodePolyline } from "@/lib/polyline";
import type { DirectionsResponse } from "@/types/directions";

interface MapItem {
  title: string;
  latitude: number;
  longitude: number;
  orderIndex: number;
}

interface RouteDayMapProps {
  items: MapItem[];
  activeRoute?: DirectionsResponse | null;
}

function RoutePolyline({ encoded }: { encoded: string }) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !encoded) return;

    const path = decodePolyline(encoded);

    polylineRef.current = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map,
    });

    return () => {
      polylineRef.current?.setMap(null);
    };
  }, [map, encoded]);

  return null;
}

function MapContent({ items, activeRoute }: RouteDayMapProps) {
  const map = useMap();

  // Fit bounds to include all markers
  useEffect(() => {
    if (!map || items.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    items.forEach((item) => {
      bounds.extend({ lat: item.latitude, lng: item.longitude });
    });
    map.fitBounds(bounds, 50);
  }, [map, items]);

  return (
    <>
      {items.map((item, i) => (
        <AdvancedMarker
          key={i}
          position={{ lat: item.latitude, lng: item.longitude }}
          title={item.title}
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
            {item.orderIndex}
          </div>
        </AdvancedMarker>
      ))}
      {activeRoute?.overviewPolyline && (
        <RoutePolyline encoded={activeRoute.overviewPolyline} />
      )}
    </>
  );
}

export function RouteDayMap({ items, activeRoute }: RouteDayMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const center = useMemo(() => {
    if (items.length === 0) return { lat: 35.6762, lng: 139.6503 };
    return {
      lat: items.reduce((s, i) => s + i.latitude, 0) / items.length,
      lng: items.reduce((s, i) => s + i.longitude, 0) / items.length,
    };
  }, [items]);

  if (!apiKey || items.length < 2) return null;

  return (
    <div className="h-80 overflow-hidden rounded-lg border">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={13}
          mapId="route-day-map"
          gestureHandling="greedy"
          disableDefaultUI
        >
          <MapContent items={items} activeRoute={activeRoute} />
        </Map>
      </APIProvider>
    </div>
  );
}
