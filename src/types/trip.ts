import type {
  Trip,
  TripDay,
  ItineraryItem,
  BudgetCategory,
  Expense,
} from "@/generated/prisma/client";

export type TripWithDays = Trip & {
  tripDays: (TripDay & {
    itineraryItems: ItineraryItem[];
  })[];
  budgetCategories: BudgetCategory[];
};

export type TripSummary = Pick<
  Trip,
  | "id"
  | "title"
  | "destination"
  | "startDate"
  | "endDate"
  | "totalBudget"
  | "status"
  | "coverImageUrl"
>;

export type ItineraryItemWithExpenses = ItineraryItem & {
  expenses: Expense[];
};

export type BudgetSummary = {
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
};

export interface InsuranceInfo {
  providerName?: string;
  policyNumber?: string;
  emergencyPhone?: string;
  notes?: string;
}
