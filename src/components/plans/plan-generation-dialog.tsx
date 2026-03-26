"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePlanGeneration } from "@/hooks/use-plan-generation";
import { SparklesIcon, Loader2Icon } from "lucide-react";
import type { Trip } from "@/generated/prisma/client";

interface PlanGenerationDialogProps {
  trip: Trip;
  userPreferences?: {
    accommodationType?: string;
    budgetLevel?: string;
    interests?: string[];
    dietaryRestrictions?: string;
    preferredTransport?: string;
  } | null;
  onGenerated: () => void;
}

export function PlanGenerationDialog({
  trip,
  userPreferences,
  onGenerated,
}: PlanGenerationDialogProps) {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState("");
  const { generate, isGenerating } = usePlanGeneration();

  async function handleGenerate() {
    const success = await generate({
      tripId: trip.id,
      destination: trip.destination,
      startDate: trip.startDate.toString(),
      endDate: trip.endDate.toString(),
      totalBudget: trip.totalBudget,
      travelStyle: trip.travelStyle ?? undefined,
      preferences: preferences || undefined,
      userPreferences: userPreferences ?? undefined,
    });

    if (success) {
      toast.success("3つのプランを生成しました");
      setOpen(false);
      onGenerated();
    } else {
      toast.error("プラン生成に失敗しました");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-1.5" />}>
        <SparklesIcon className="size-4" />
        プランを生成
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AIプラン提案</DialogTitle>
          <DialogDescription>
            {trip.destination}への旅行プランを3つのティア（エコノミー・スタンダード・プレミアム）で生成します。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p>目的地: {trip.destination}</p>
            <p>予算: {trip.totalBudget.toLocaleString()}円</p>
            {trip.travelStyle && <p>スタイル: {trip.travelStyle}</p>}
            {userPreferences && (
              <p className="mt-1 text-xs text-muted-foreground">
                ユーザー設定が反映されます
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferences">追加の希望（任意）</Label>
            <Textarea
              id="preferences"
              placeholder="例: 温泉旅館に泊まりたい、食べ歩きを楽しみたい..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                生成中...（30秒ほどかかります）
              </>
            ) : (
              "3つのプランを生成する"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
