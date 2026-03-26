import { z } from "zod";

export const nearbySearchSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  type: z.enum(["hospital", "pharmacy", "doctor"]),
});
