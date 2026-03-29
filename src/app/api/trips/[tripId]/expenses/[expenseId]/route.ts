import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  const { tripId, expenseId } = await props.params;

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

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: dbUser.id },
  });
  if (!trip) {
    return NextResponse.json({ error: "旅行が見つかりません" }, { status: 404 });
  }

  await prisma.expense.delete({ where: { id: expenseId } });

  return NextResponse.json({ success: true });
}
