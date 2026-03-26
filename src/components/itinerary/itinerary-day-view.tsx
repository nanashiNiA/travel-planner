"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RouteDayMap } from "@/components/route/route-day-map";
import { DirectionsPanel } from "@/components/route/directions-panel";
import { TravelModeSelector } from "@/components/route/travel-mode-selector";
import { useDirections } from "@/hooks/use-directions";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { MapIcon, NavigationIcon } from "lucide-react";
import type { TripDay, ItineraryItem } from "@/generated/prisma/client";
import type { TravelMode } from "@/types/directions";

interface ItineraryDayViewProps {
  day: TripDay & { itineraryItems: ItineraryItem[] };
  itemTypeLabels: Record<string, string>;
}

const typeColors: Record<string, string> = {
  ATTRACTION: "bg-blue-100 text-blue-800",
  RESTAURANT: "bg-orange-100 text-orange-800",
  TRANSPORT: "bg-green-100 text-green-800",
  ACCOMMODATION: "bg-purple-100 text-purple-800",
  ACTIVITY: "bg-yellow-100 text-yellow-800",
  OTHER: "bg-gray-100 text-gray-800",
};

function hasCoords(item: ItineraryItem): boolean {
  return item.latitude != null && item.longitude != null;
}

export function ItineraryDayView({
  day,
  itemTypeLabels,
}: ItineraryDayViewProps) {
  const [showMap, setShowMap] = useState(false);
  const [activeSegment, setActiveSegment] = useState<{
    fromIndex: number;
    toIndex: number;
  } | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>("TRANSIT");
  const { data: directions, loading, error, fetchDirections, clear } = useDirections();

  const mapItems = useMemo(
    () =>
      day.itineraryItems
        .filter(hasCoords)
        .map((item) => ({
          title: item.title,
          latitude: item.latitude!,
          longitude: item.longitude!,
          orderIndex: item.orderIndex,
        })),
    [day.itineraryItems]
  );

  const hasMapItems = mapItems.length >= 2;

  async function handleGetDirections(fromIdx: number, toIdx: number, mode: TravelMode) {
    const fromItem = day.itineraryItems[fromIdx];
    const toItem = day.itineraryItems[toIdx];

    if (!hasCoords(fromItem) || !hasCoords(toItem)) return;

    setActiveSegment({ fromIndex: fromIdx, toIndex: toIdx });

    await fetchDirections(
      { latitude: fromItem.latitude!, longitude: fromItem.longitude! },
      { latitude: toItem.latitude!, longitude: toItem.longitude! },
      mode
    );
  }

  function handleCloseDirections() {
    setActiveSegment(null);
    clear();
  }

  function handleModeChange(mode: TravelMode) {
    setTravelMode(mode);
    if (activeSegment) {
      handleGetDirections(activeSegment.fromIndex, activeSegment.toIndex, mode);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Day {day.dayNumber} -{" "}
            {format(new Date(day.date), "M/d (E)", { locale: ja })}
          </CardTitle>
          {hasMapItems && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="gap-1.5"
            >
              <MapIcon className="size-4" />
              {showMap ? "地図を非表示" : "地図を表示"}
            </Button>
          )}
        </div>
        {day.memo && (
          <p className="text-sm text-muted-foreground">{day.memo}</p>
        )}
      </CardHeader>
      <CardContent>
        {/* Route Map */}
        {showMap && hasMapItems && (
          <div className="mb-4">
            <RouteDayMap items={mapItems} activeRoute={directions} />
          </div>
        )}

        {day.itineraryItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            この日の予定はまだありません
          </p>
        ) : (
          <div className="space-y-4">
            {day.itineraryItems.map((item, index) => {
              const nextItem = day.itineraryItems[index + 1];
              const canNavigate =
                nextItem && hasCoords(item) && hasCoords(nextItem);
              const isActive =
                activeSegment?.fromIndex === index &&
                activeSegment?.toIndex === index + 1;

              return (
                <div key={item.id}>
                  {index > 0 && <Separator className="mb-4" />}
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">
                      {item.startTime && (
                        <p className="font-medium">{item.startTime}</p>
                      )}
                      {item.endTime && <p>{item.endTime}</p>}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.title}</h4>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[item.type] ?? typeColors.OTHER}`}
                        >
                          {itemTypeLabels[item.type] ?? item.type}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      {item.address && (
                        <p className="text-xs text-muted-foreground">
                          {item.address}
                        </p>
                      )}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {item.estimatedCost != null &&
                          item.estimatedCost > 0 && (
                            <span>
                              {item.estimatedCost.toLocaleString()}円
                            </span>
                          )}
                        {item.notes && <span>{item.notes}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Route Navigation Button */}
                  {canNavigate && (
                    <div className="ml-16 mt-3 flex items-center gap-2">
                      <Button
                        variant={isActive ? "default" : "outline"}
                        size="xs"
                        onClick={() =>
                          isActive
                            ? handleCloseDirections()
                            : handleGetDirections(index, index + 1, travelMode)
                        }
                        className="gap-1"
                      >
                        <NavigationIcon className="size-3" />
                        ルート案内
                      </Button>
                      {isActive && (
                        <TravelModeSelector
                          value={travelMode}
                          onChange={handleModeChange}
                        />
                      )}
                    </div>
                  )}

                  {/* Directions Panel */}
                  {isActive && (
                    <div className="ml-16 mt-1">
                      <DirectionsPanel
                        directions={directions}
                        loading={loading}
                        error={error}
                        originName={item.title}
                        destinationName={nextItem.title}
                        onClose={handleCloseDirections}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
