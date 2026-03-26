import { z } from "zod";

export const generatePlanSchema = z.object({
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalBudget: z.number(),
  travelStyle: z.string().optional(),
  preferences: z.string().optional(),
  userPreferences: z
    .object({
      accommodationType: z.string().optional(),
      budgetLevel: z.string().optional(),
      interests: z.array(z.string()).optional(),
      dietaryRestrictions: z.string().optional(),
      preferredTransport: z.string().optional(),
    })
    .optional(),
});

export const swapPlanItemSchema = z.object({
  alternativeIndex: z.number().int().min(0),
});

export const selectPlanSchema = z.object({
  planId: z.string(),
});
