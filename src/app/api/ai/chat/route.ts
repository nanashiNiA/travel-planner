import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  CHAT_SYSTEM_PROMPT,
  buildChatContextPrompt,
} from "@/prompts/chat-support";

// Extract text content from UIMessage parts format
function extractTextFromParts(
  parts: Array<{ type: string; text?: string }>
): string {
  return parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text!)
    .join("");
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "認証が必要です" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return Response.json(
      { error: "ユーザーが見つかりません" },
      { status: 404 }
    );
  }

  const body = await req.json();

  // DefaultChatTransport sends: { id, messages (UIMessage[]), trigger, messageId, ...body }
  const messages: Array<{
    role: "user" | "assistant" | "system";
    parts?: Array<{ type: string; text?: string }>;
    content?: string;
  }> = body.messages ?? [];
  const conversationId: string | undefined = body.conversationId;
  const tripId: string | undefined = body.tripId;

  if (!messages.length) {
    return Response.json({ error: "メッセージが必要です" }, { status: 400 });
  }

  // Convert UIMessage parts format to plain text for streamText
  const plainMessages = messages.map((m) => ({
    role: m.role,
    content: m.parts ? extractTextFromParts(m.parts) : m.content ?? "",
  }));

  // Build system prompt with optional trip context
  let systemPrompt = CHAT_SYSTEM_PROMPT;

  if (tripId) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: dbUser.id },
      include: {
        tripDays: {
          orderBy: { dayNumber: "asc" },
          include: {
            itineraryItems: { orderBy: { orderIndex: "asc" } },
          },
        },
      },
    });

    if (trip) {
      systemPrompt += "\n\n" + buildChatContextPrompt(trip);
    }
  }

  // Get or create conversation
  let convId = conversationId;

  if (!convId) {
    const firstUserMessage = plainMessages.find((m) => m.role === "user");
    const conversation = await prisma.chatConversation.create({
      data: {
        userId: dbUser.id,
        tripId: tripId ?? null,
        title: firstUserMessage?.content.slice(0, 50) ?? "New conversation",
      },
    });
    convId = conversation.id;
  }

  // Save the latest user message
  const lastUserMessage = [...plainMessages]
    .reverse()
    .find((m) => m.role === "user");
  if (lastUserMessage) {
    await prisma.chatMessage.create({
      data: {
        conversationId: convId,
        role: "user",
        content: lastUserMessage.content,
      },
    });
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: plainMessages,
    onFinish: async ({ text }) => {
      // Save assistant response after streaming completes
      await prisma.chatMessage.create({
        data: {
          conversationId: convId!,
          role: "assistant",
          content: text,
        },
      });

      // Update conversation timestamp
      await prisma.chatConversation.update({
        where: { id: convId! },
        data: { updatedAt: new Date() },
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
