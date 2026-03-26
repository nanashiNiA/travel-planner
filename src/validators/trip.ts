import { z } from "zod";

export const createTripSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  destination: z
    .string()
    .min(1, "目的地を入力してください")
    .max(200, "目的地は200文字以内で入力してください"),
  startDate: z.string().min(1, "開始日を選択してください"),
  endDate: z.string().min(1, "終了日を選択してください"),
  totalBudget: z
    .number()
    .min(0, "予算は0以上で入力してください")
    .max(100000000, "予算が大きすぎます"),
  currency: z.string().optional().default("JPY"),
  travelStyle: z
    .enum(["relaxed", "active", "gourmet", "cultural", "adventure"])
    .optional(),
});

export type CreateTripInput = z.input<typeof createTripSchema>;

export const generateItinerarySchema = z.object({
  destination: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  totalBudget: z.number().min(0),
  travelStyle: z.string().optional(),
  preferences: z.string().optional(),
});

export type GenerateItineraryInput = z.infer<typeof generateItinerarySchema>;
