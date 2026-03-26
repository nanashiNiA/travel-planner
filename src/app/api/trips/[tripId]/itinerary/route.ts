import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

interface GeneratedItem {
  type: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  estimatedCost?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

interface GeneratedDay {
  dayNumber: number;
  items: GeneratedItem[];
}

interface GeneratedItinerary {
  days: GeneratedDay[];
}

export async function POST(
  req: Request,
  props: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { generatedText } = await req.json();

  // AIの出力からJSONを抽出
  let itineraryData: GeneratedItinerary;
  try {
    // テキストストリームからデータ部分を抽出
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON not found in response");
    }
    itineraryData = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json(
      { error: "AI出力の解析に失敗しました" },
      { status: 400 }
    );
  }

  // 旅行の日程を取得
  const tripDays = await prisma.tripDay.findMany({
    where: { tripId },
    orderBy: { dayNumber: "asc" },
  });

  if (tripDays.length === 0) {
    return NextResponse.json(
      { error: "旅行の日程が見つかりません" },
      { status: 404 }
    );
  }

  // 既存の旅程アイテムを削除
  await prisma.itineraryItem.deleteMany({
    where: { tripDayId: { in: tripDays.map((d) => d.id) } },
  });

  // 生成された旅程を保存
  for (const generatedDay of itineraryData.days) {
    const tripDay = tripDays[generatedDay.dayNumber - 1];
    if (!tripDay) continue;

    await prisma.itineraryItem.createMany({
      data: generatedDay.items.map((item, index) => ({
        tripDayId: tripDay.id,
        orderIndex: index,
        type: validateItemType(item.type),
        title: item.title,
        description: item.description ?? null,
        startTime: item.startTime ?? null,
        endTime: item.endTime ?? null,
        estimatedCost: item.estimatedCost ?? null,
        address: item.address ?? null,
        latitude: item.latitude ?? null,
        longitude: item.longitude ?? null,
        notes: item.notes ?? null,
      })),
    });
  }

  // ステータスを更新
  await prisma.trip.update({
    where: { id: tripId },
    data: { status: "PLANNED" },
  });

  return NextResponse.json({ success: true });
}

function validateItemType(
  type: string
): "ATTRACTION" | "RESTAURANT" | "TRANSPORT" | "ACCOMMODATION" | "ACTIVITY" | "OTHER" {
  const validTypes = [
    "ATTRACTION",
    "RESTAURANT",
    "TRANSPORT",
    "ACCOMMODATION",
    "ACTIVITY",
    "OTHER",
  ] as const;
  const upper = type.toUpperCase();
  if (validTypes.includes(upper as (typeof validTypes)[number])) {
    return upper as (typeof validTypes)[number];
  }
  return "OTHER";
}
