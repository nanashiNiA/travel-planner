import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createBookmarkSchema } from "@/validators/bookmark";

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({ where: { supabaseId: user.id } });
}

export async function GET(req: Request) {
  const dbUser = await getAuthUser();
  if (!dbUser) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const tripId = searchParams.get("tripId");

  const where: { userId: string; type?: string; tripId?: string } = {
    userId: dbUser.id,
  };
  if (type) where.type = type;
  if (tripId) where.tripId = tripId;

  const bookmarks = await prisma.bookmark.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookmarks);
}

export async function POST(req: Request) {
  const dbUser = await getAuthUser();
  if (!dbUser) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createBookmarkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容が正しくありません", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { metadata, ...rest } = parsed.data;
  const bookmark = await prisma.bookmark.create({
    data: {
      userId: dbUser.id,
      ...rest,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata: metadata as any,
    },
  });

  return NextResponse.json(bookmark, { status: 201 });
}
