import { z } from "zod";

export const insuranceInfoSchema = z.object({
  providerName: z.string().max(200).optional(),
  policyNumber: z.string().max(100).optional(),
  emergencyPhone: z.string().max(50).optional(),
  notes: z.string().max(1000).optional(),
});
