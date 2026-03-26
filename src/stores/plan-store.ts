import { create } from "zustand";
import type { TravelPlanWithItems } from "@/types/plan";

interface PlanStore {
  plans: TravelPlanWithItems[];
  selectedPlanId: string | null;
  isGenerating: boolean;
  setPlans: (plans: TravelPlanWithItems[]) => void;
  setSelectedPlanId: (id: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
}

export const usePlanStore = create<PlanStore>((set) => ({
  plans: [],
  selectedPlanId: null,
  isGenerating: false,
  setPlans: (plans) => set({ plans }),
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
}));
