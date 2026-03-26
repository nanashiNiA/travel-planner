import type { TravelPlan, TravelPlanItem } from "@/generated/prisma/client";

export type TravelPlanWithItems = TravelPlan & {
  items: TravelPlanItem[];
};

export interface PlanAlternative {
  title: string;
  description?: string;
  estimatedCost: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  bookingUrl?: string;
}

export interface GeneratedPlanDay {
  dayNumber: number;
  items: GeneratedPlanItem[];
}

export interface GeneratedPlanItem {
  category: string;
  title: string;
  description?: string;
  estimatedCost: number;
  startTime?: string;
  endTime?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bookingUrl?: string;
  alternatives?: PlanAlternative[];
}

export interface GeneratedPlan {
  tier: "BUDGET" | "STANDARD" | "PREMIUM";
  totalCost: number;
  summary: string;
  days: GeneratedPlanDay[];
}

export interface GeneratedPlanResponse {
  plans: GeneratedPlan[];
  tips: string[];
}

export interface UserPreferenceInput {
  accommodationType?: string;
  budgetLevel?: string;
  interests?: string[];
  dietaryRestrictions?: string;
  mobilityNeeds?: string;
  preferredTransport?: string;
}
