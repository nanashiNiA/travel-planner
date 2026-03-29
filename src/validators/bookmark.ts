import { z } from "zod";

export const createBookmarkSchema = z.object({
  type: z.enum(["place", "restaurant", "hotel", "phrase", "translation"]),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional(),
  address: z.string().max(500).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mapsUrl: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  tripId: z.string().optional(),
});
