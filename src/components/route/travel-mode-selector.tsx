"use client";

import { Button } from "@/components/ui/button";
import { FootprintsIcon, TrainFrontIcon, CarIcon } from "lucide-react";
import type { TravelMode } from "@/types/directions";

const MODES: { mode: TravelMode; label: string; icon: React.ElementType }[] = [
  { mode: "WALKING", label: "徒歩", icon: FootprintsIcon },
  { mode: "TRANSIT", label: "公共交通", icon: TrainFrontIcon },
  { mode: "DRIVING", label: "車", icon: CarIcon },
];

interface TravelModeSelectorProps {
  value: TravelMode;
  onChange: (mode: TravelMode) => void;
}

export function TravelModeSelector({ value, onChange }: TravelModeSelectorProps) {
  return (
    <div className="flex gap-1">
      {MODES.map(({ mode, label, icon: Icon }) => (
        <Button
          key={mode}
          variant={value === mode ? "default" : "outline"}
          size="xs"
          onClick={() => onChange(mode)}
          className="gap-1"
        >
          <Icon className="size-3" />
          {label}
        </Button>
      ))}
    </div>
  );
}
