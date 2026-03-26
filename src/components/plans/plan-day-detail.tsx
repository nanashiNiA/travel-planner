"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlanItemSwap } from "@/components/plans/plan-item-swap";
import {
  HotelIcon,
  MapPinIcon,
  TrainFrontIcon,
  UtensilsIcon,
  SparklesIcon,
} from "lucide-react";
import type { TravelPlanItem } from "@/generated/prisma/client";

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  accommodation: { label: "宿泊", icon: HotelIcon, color: "bg-purple-100 text-purple-800" },
  sightseeing: { label: "観光", icon: MapPinIcon, color: "bg-blue-100 text-blue-800" },
  transport: { label: "移動", icon: TrainFrontIcon, color: "bg-green-100 text-green-800" },
  food: { label: "食事", icon: UtensilsIcon, color: "bg-orange-100 text-orange-800" },
  activity: { label: "体験", icon: SparklesIcon, color: "bg-yellow-100 text-yellow-800" },
};

interface PlanDayDetailProps {
  dayNumber: number;
  items: TravelPlanItem[];
  planId: string;
  onSwapItem: (itemId: string, alternativeIndex: number) => void;
}

export function PlanDayDetail({
  dayNumber,
  items,
  planId,
  onSwapItem,
}: PlanDayDetailProps) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold">Day {dayNumber}</h4>
      <div className="space-y-2">
        {items.map((item, idx) => {
          const config = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG.sightseeing;
          const Icon = config.icon;
          const alternatives = (item.alternatives ?? []) as Array<{
            title: string;
            description?: string;
            estimatedCost: number;
            address?: string;
          }>;

          return (
            <div key={item.id}>
              {idx > 0 && <Separator className="my-2" />}
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-md p-1.5 ${config.color}`}>
                  <Icon className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.isCustomized && (
                      <Badge variant="outline" className="text-xs">
                        変更済み
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    {item.startTime && <span>{item.startTime}</span>}
                    <span className="font-medium">
                      ¥{item.estimatedCost.toLocaleString()}
                    </span>
                    {item.address && (
                      <span className="truncate">{item.address}</span>
                    )}
                  </div>
                </div>
                {alternatives.length > 0 && (
                  <PlanItemSwap
                    itemId={item.id}
                    currentCost={item.estimatedCost}
                    alternatives={alternatives}
                    planId={planId}
                    onSwap={onSwapItem}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
