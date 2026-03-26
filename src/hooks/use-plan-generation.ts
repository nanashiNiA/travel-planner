"use client";

import { useState, useCallback } from "react";

interface GeneratePlanParams {
  tripId: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  travelStyle?: string;
  preferences?: string;
  userPreferences?: {
    accommodationType?: string;
    budgetLevel?: string;
    interests?: string[];
    dietaryRestrictions?: string;
    preferredTransport?: string;
  };
}

export function usePlanGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (params: GeneratePlanParams) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Step 1: Stream AI recommendation
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: params.destination,
          startDate: params.startDate,
          endDate: params.endDate,
          totalBudget: params.totalBudget,
          travelStyle: params.travelStyle,
          preferences: params.preferences,
          userPreferences: params.userPreferences,
        }),
      });

      if (!res.ok) {
        throw new Error("プラン生成に失敗しました");
      }

      // Read streaming response
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

      // Step 2: Save plans to DB
      const saveRes = await fetch(`/api/trips/${params.tripId}/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedText: fullText }),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json().catch(() => null);
        throw new Error(err?.error ?? "プランの保存に失敗しました");
      }

      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generate, isGenerating, error };
}
