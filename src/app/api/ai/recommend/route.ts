import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  PLAN_RECOMMENDATION_SYSTEM_PROMPT,
  buildPlanRecommendationPrompt,
} from "@/prompts/plan-recommender";
import { generatePlanSchema } from "@/validators/plan";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = generatePlanSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "入力内容が正しくありません", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const prompt = buildPlanRecommendationPrompt(parsed.data);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: PLAN_RECOMMENDATION_SYSTEM_PROMPT,
    prompt,
  });

  return result.toTextStreamResponse();
}
