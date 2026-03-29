import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ bookmarkId: string }> }
) {
  const { bookmarkId } = await props.params;

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
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  const bookmark = await prisma.bookmark.findFirst({
    where: { id: bookmarkId, userId: dbUser.id },
  });
  if (!bookmark) {
    return NextResponse.json({ error: "ブックマークが見つかりません" }, { status: 404 });
  }

  await prisma.bookmark.delete({ where: { id: bookmarkId } });

  return NextResponse.json({ success: true });
}
