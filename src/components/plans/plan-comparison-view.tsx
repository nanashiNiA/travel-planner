"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PlanTierCard } from "@/components/plans/plan-tier-card";
import { PlanApplyButton } from "@/components/plans/plan-apply-button";
import { toast } from "sonner";
import type { TravelPlanWithItems } from "@/types/plan";

interface PlanComparisonViewProps {
  plans: TravelPlanWithItems[];
  tripId: string;
}

export function PlanComparisonView({ plans, tripId }: PlanComparisonViewProps) {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    plans.find((p) => p.isSelected)?.id ?? null
  );

  const handleSwapItem = useCallback(
    async (itemId: string, alternativeIndex: number) => {
      const plan = plans.find((p) =>
        p.items.some((i) => i.id === itemId)
      );
      if (!plan) return;

      try {
        const res = await fetch(
          `/api/trips/${tripId}/plans/${plan.id}/items/${itemId}/swap`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alternativeIndex }),
          }
        );

        if (res.ok) {
          toast.success("アイテムを入れ替えました");
          router.refresh();
        } else {
          toast.error("入れ替えに失敗しました");
        }
      } catch {
        toast.error("通信エラーが発生しました");
      }
    },
    [plans, tripId, router]
  );

  // Determine recommended plan (STANDARD or closest to user's budget)
  const recommendedId =
    plans.find((p) => p.tier === "STANDARD")?.id ?? plans[1]?.id;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanTierCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
            isRecommended={plan.id === recommendedId}
            onSelect={setSelectedPlanId}
            onSwapItem={handleSwapItem}
          />
        ))}
      </div>

      {selectedPlanId && (
        <PlanApplyButton tripId={tripId} planId={selectedPlanId} />
      )}
    </div>
  );
}
