"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import type { Trip } from "@/generated/prisma/client";

interface AiGenerateButtonProps {
  trip: Trip;
}

export function AiGenerateButton({ trip }: AiGenerateButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
          totalBudget: trip.totalBudget,
          travelStyle: trip.travelStyle,
          preferences,
        }),
      });

      if (!res.ok) {
        throw new Error("AI生成に失敗しました");
      }

      // ストリーミングレスポンスを読み取り
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
      }

      // 生成された旅程をDBに保存
      const saveRes = await fetch(`/api/trips/${trip.id}/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedText: fullText }),
      });

      if (!saveRes.ok) {
        throw new Error("旅程の保存に失敗しました");
      }

      toast.success("旅程を生成しました");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "エラーが発生しました"
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        AIで旅程を生成
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI旅程生成</DialogTitle>
          <DialogDescription>
            {trip.destination}への旅行プランをAIが自動生成します。
            追加の希望があれば入力してください。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              目的地: {trip.destination} / 予算:{" "}
              {trip.totalBudget.toLocaleString()}円
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferences">追加の希望（任意）</Label>
            <Textarea
              id="preferences"
              placeholder="例: 神社仏閣を中心に回りたい、食べ歩きを楽しみたい、子連れなので..."
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
            {isGenerating ? "生成中..." : "旅程を生成する"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
