import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createTripSchema } from "@/validators/trip";
import { addDays, parseISO } from "date-fns";

export async function GET() {
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

  const trips = await prisma.trip.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      destination: true,
      startDate: true,
      endDate: true,
      totalBudget: true,
      status: true,
      coverImageUrl: true,
    },
  });

  return NextResponse.json(trips);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createTripSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容が正しくありません", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // ユーザーをDBで取得 or 作成
  const dbUser = await prisma.user.upsert({
    where: { supabaseId: user.id },
    update: {},
    create: {
      supabaseId: user.id,
      email: user.email!,
      displayName: user.user_metadata?.full_name ?? null,
      avatarUrl: user.user_metadata?.avatar_url ?? null,
    },
  });

  const startDate = parseISO(parsed.data.startDate);
  const endDate = parseISO(parsed.data.endDate);

  // 旅行プランと日程を同時作成
  const dayCount =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const trip = await prisma.trip.create({
    data: {
      userId: dbUser.id,
      title: parsed.data.title,
      destination: parsed.data.destination,
      startDate,
      endDate,
      totalBudget: parsed.data.totalBudget,
      currency: parsed.data.currency,
      travelStyle: parsed.data.travelStyle,
      tripDays: {
        create: Array.from({ length: dayCount }, (_, i) => ({
          dayNumber: i + 1,
          date: addDays(startDate, i),
        })),
      },
    },
    include: {
      tripDays: true,
    },
  });

  return NextResponse.json(trip, { status: 201 });
}
