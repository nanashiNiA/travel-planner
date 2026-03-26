import { z } from "zod";

export const userPreferenceSchema = z.object({
  accommodationType: z.string().max(50).optional(),
  budgetLevel: z.string().max(50).optional(),
  interests: z.array(z.string().max(50)).max(20).optional(),
  dietaryRestrictions: z.string().max(200).optional(),
  mobilityNeeds: z.string().max(200).optional(),
  preferredTransport: z.string().max(50).optional(),
});
