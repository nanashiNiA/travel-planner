import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return NextResponse.json(
      { error: "ユーザーが見つかりません" },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  // Return single conversation with messages
  if (conversationId) {
    const conversation = await prisma.chatConversation.findFirst({
      where: { id: conversationId, userId: dbUser.id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "会話が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  }

  // Return all conversations list
  const conversations = await prisma.chatConversation.findMany({
    where: { userId: dbUser.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      tripId: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  });

  return NextResponse.json(conversations);
}
