import { z } from "zod";

export const directionsRequestSchema = z.object({
  origin: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  destination: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  mode: z.enum(["WALKING", "TRANSIT", "DRIVING"]).default("TRANSIT"),
});
