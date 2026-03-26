"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlanDayDetail } from "@/components/plans/plan-day-detail";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  StarIcon,
} from "lucide-react";
import type { TravelPlanWithItems } from "@/types/plan";

const TIER_CONFIG: Record<
  string,
  { label: string; color: string; badgeVariant: "default" | "secondary" | "outline" }
> = {
  BUDGET: { label: "エコノミー", color: "border-green-500/50", badgeVariant: "secondary" },
  STANDARD: { label: "スタンダード", color: "border-blue-500/50", badgeVariant: "default" },
  PREMIUM: { label: "プレミアム", color: "border-amber-500/50", badgeVariant: "outline" },
};

interface PlanTierCardProps {
  plan: TravelPlanWithItems;
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: (planId: string) => void;
  onSwapItem: (itemId: string, alternativeIndex: number) => void;
}

export function PlanTierCard({
  plan,
  isSelected,
  isRecommended,
  onSelect,
  onSwapItem,
}: PlanTierCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = TIER_CONFIG[plan.tier] ?? TIER_CONFIG.STANDARD;

  // Group items by day
  const dayGroups = plan.items.reduce(
    (acc, item) => {
      if (!acc[item.dayNumber]) acc[item.dayNumber] = [];
      acc[item.dayNumber].push(item);
      return acc;
    },
    {} as Record<number, typeof plan.items>
  );

  return (
    <Card
      className={`relative transition-all ${config.color} ${
        isSelected ? "border-2 ring-2 ring-primary/20" : ""
      }`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-4">
          <Badge className="gap-1 bg-amber-500 text-white">
            <StarIcon className="size-3" />
            おすすめ
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant={config.badgeVariant}>{config.label}</Badge>
            <CardTitle className="mt-2 text-2xl">
              ¥{plan.totalCost.toLocaleString()}
            </CardTitle>
          </div>
          {isSelected && (
            <CheckCircleIcon className="size-6 text-primary" />
          )}
        </div>
        {plan.summary && (
          <p className="text-sm text-muted-foreground">{plan.summary}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => onSelect(plan.id)}
          >
            {isSelected ? "選択中" : "このプランを選択"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-1"
          >
            {expanded ? (
              <>
                <ChevronUpIcon className="size-4" />
                閉じる
              </>
            ) : (
              <>
                <ChevronDownIcon className="size-4" />
                詳細
              </>
            )}
          </Button>
        </div>

        {expanded && (
          <div className="space-y-4 pt-2">
            {Object.entries(dayGroups).map(([dayNum, items]) => (
              <PlanDayDetail
                key={dayNum}
                dayNumber={Number(dayNum)}
                items={items}
                planId={plan.id}
                onSwapItem={onSwapItem}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
