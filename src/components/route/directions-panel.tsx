"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  FootprintsIcon,
  TrainFrontIcon,
  BusIcon,
  CarIcon,
  ClockIcon,
  MapPinIcon,
  XIcon,
} from "lucide-react";
import type { DirectionsResponse, DirectionsStep } from "@/types/directions";

function getStepIcon(step: DirectionsStep) {
  if (step.travelMode === "WALKING") return FootprintsIcon;
  if (step.transitDetails) {
    const vt = step.transitDetails.vehicleType;
    if (vt === "BUS") return BusIcon;
    return TrainFrontIcon;
  }
  return CarIcon;
}

interface DirectionsPanelProps {
  directions: DirectionsResponse | null;
  loading: boolean;
  error?: string | null;
  originName: string;
  destinationName: string;
  onClose: () => void;
}

export function DirectionsPanel({
  directions,
  loading,
  error,
  originName,
  destinationName,
  onClose,
}: DirectionsPanelProps) {
  if (loading) {
    return (
      <Card className="my-2">
        <CardContent className="space-y-3 pt-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="my-2">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!directions) return null;

  return (
    <Card className="my-2">
      <CardHeader className="flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-sm">
            {originName} → {destinationName}
          </CardTitle>
          <div className="mt-1 flex gap-2">
            <Badge variant="secondary" className="gap-1 text-xs">
              <ClockIcon className="size-3" />
              {directions.duration}
            </Badge>
            <Badge variant="secondary" className="gap-1 text-xs">
              <MapPinIcon className="size-3" />
              {directions.distance}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <XIcon className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-60">
          <div className="space-y-2">
            {directions.steps.map((step, i) => {
              const Icon = getStepIcon(step);
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="size-3.5" />
                    </div>
                    {i < directions.steps.length - 1 && (
                      <div className="mt-1 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <p
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: step.instruction,
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      {step.distance} ・ {step.duration}
                    </p>
                    {step.transitDetails && (
                      <div
                        className="mt-1 rounded-md border-l-4 bg-muted/50 px-3 py-2"
                        style={{
                          borderLeftColor:
                            step.transitDetails.lineColor ?? "#666",
                        }}
                      >
                        <p className="text-sm font-medium">
                          {step.transitDetails.lineName ||
                            step.transitDetails.lineShortName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.transitDetails.departureStop} →{" "}
                          {step.transitDetails.arrivalStop}
                          {step.transitDetails.numStops > 0 &&
                            ` (${step.transitDetails.numStops}駅)`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.transitDetails.departureTime} →{" "}
                          {step.transitDetails.arrivalTime}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
