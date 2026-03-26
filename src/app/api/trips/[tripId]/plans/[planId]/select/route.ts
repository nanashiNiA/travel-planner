import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const CATEGORY_TO_ITEM_TYPE: Record<string, string> = {
  accommodation: "ACCOMMODATION",
  sightseeing: "ATTRACTION",
  transport: "TRANSPORT",
  food: "RESTAURANT",
  activity: "ACTIVITY",
};

export async function POST(
  _req: Request,
  props: { params: Promise<{ tripId: string; planId: string }> }
) {
  const { tripId, planId } = await props.params;

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
    include: { tripDays: { orderBy: { dayNumber: "asc" } } },
  });
  if (!trip) {
    return NextResponse.json({ error: "旅行が見つかりません" }, { status: 404 });
  }

  const plan = await prisma.travelPlan.findFirst({
    where: { id: planId, tripId },
    include: { items: { orderBy: [{ dayNumber: "asc" }, { orderIndex: "asc" }] } },
  });
  if (!plan) {
    return NextResponse.json({ error: "プランが見つかりません" }, { status: 404 });
  }

  // Mark this plan as selected, others as not
  await prisma.travelPlan.updateMany({
    where: { tripId },
    data: { isSelected: false },
  });
  await prisma.travelPlan.update({
    where: { id: planId },
    data: { isSelected: true },
  });

  // Delete existing itinerary items
  for (const day of trip.tripDays) {
    await prisma.itineraryItem.deleteMany({
      where: { tripDayId: day.id },
    });
  }

  // Convert plan items to itinerary items
  const dayMap = new Map(trip.tripDays.map((d) => [d.dayNumber, d.id]));

  for (const item of plan.items) {
    const tripDayId = dayMap.get(item.dayNumber);
    if (!tripDayId) continue;

    await prisma.itineraryItem.create({
      data: {
        tripDayId,
        orderIndex: item.orderIndex,
        type: (CATEGORY_TO_ITEM_TYPE[item.category] ?? "OTHER") as "ATTRACTION" | "RESTAURANT" | "TRANSPORT" | "ACCOMMODATION" | "ACTIVITY" | "OTHER",
        title: item.title,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        estimatedCost: item.estimatedCost,
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
      },
    });
  }

  // Update trip status
  await prisma.trip.update({
    where: { id: tripId },
    data: { status: "PLANNED" },
  });

  return NextResponse.json({ success: true });
}
