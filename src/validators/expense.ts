import { z } from "zod";

export const createExpenseSchema = z.object({
  itineraryItemId: z.string().optional(),
  tripId: z.string().min(1),
  category: z.enum([
    "TRANSPORT",
    "ACCOMMODATION",
    "FOOD",
    "ATTRACTION",
    "SHOPPING",
    "OTHER",
  ]),
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(200, "タイトルは200文字以内で入力してください"),
  amount: z.number().min(0, "金額は0以上で入力してください"),
  originalAmount: z.number().optional(),
  originalCurrency: z.string().optional(),
  paidAt: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
