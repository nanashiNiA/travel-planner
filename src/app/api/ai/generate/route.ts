import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  ITINERARY_SYSTEM_PROMPT,
  buildItineraryPrompt,
} from "@/prompts/itinerary-generator";
import { generateItinerarySchema } from "@/validators/trip";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = generateItinerarySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "入力内容が正しくありません", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const prompt = buildItineraryPrompt(parsed.data);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: ITINERARY_SYSTEM_PROMPT,
    prompt,
  });

  return result.toTextStreamResponse();
}
