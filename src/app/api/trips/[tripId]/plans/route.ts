import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { GeneratedPlanResponse } from "@/types/plan";
import type { PlanTier } from "@/generated/prisma/client";

async function getAuthenticatedTrip(tripId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) return null;

  return prisma.trip.findFirst({
    where: { id: tripId, userId: dbUser.id },
  });
}

export async function GET(
  _req: Request,
  props: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await props.params;
  const trip = await getAuthenticatedTrip(tripId);

  if (!trip) {
    return NextResponse.json(
      { error: "旅行が見つかりません" },
      { status: 404 }
    );
  }

  const plans = await prisma.travelPlan.findMany({
    where: { tripId },
    include: { items: { orderBy: [{ dayNumber: "asc" }, { orderIndex: "asc" }] } },
    orderBy: { totalCost: "asc" },
  });

  return NextResponse.json(plans);
}

export async function POST(
  req: Request,
  props: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await props.params;
  const trip = await getAuthenticatedTrip(tripId);

  if (!trip) {
    return NextResponse.json(
      { error: "旅行が見つかりません" },
      { status: 404 }
    );
  }

  const { generatedText } = await req.json();

  // Extract JSON from AI output
  const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json(
      { error: "プランのパースに失敗しました" },
      { status: 400 }
    );
  }

  let planData: GeneratedPlanResponse;
  try {
    planData = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json(
      { error: "JSONのパースに失敗しました" },
      { status: 400 }
    );
  }

  if (!planData.plans?.length) {
    return NextResponse.json(
      { error: "プランが含まれていません" },
      { status: 400 }
    );
  }

  // Delete existing plans
  await prisma.travelPlan.deleteMany({ where: { tripId } });

  // Create all plans in a transaction
  const validTiers = ["BUDGET", "STANDARD", "PREMIUM"];

  await prisma.$transaction(
    planData.plans
      .filter((plan) => validTiers.includes(plan.tier))
      .map((plan) =>
        prisma.travelPlan.create({
          data: {
            tripId,
            tier: plan.tier as PlanTier,
            totalCost: plan.totalCost ?? 0,
            summary: plan.summary,
            items: {
              create: plan.days.flatMap((day) =>
                day.items.map((item, idx) => ({
                  dayNumber: day.dayNumber,
                  category: item.category,
                  title: item.title,
                  description: item.description,
                  estimatedCost: item.estimatedCost ?? 0,
                  startTime: item.startTime,
                  endTime: item.endTime,
                  address: item.address,
                  latitude: item.latitude,
                  longitude: item.longitude,
                  bookingUrl: item.bookingUrl,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  alternatives: (item.alternatives ?? []) as any,
                  orderIndex: idx,
                }))
              ),
            },
          },
        })
      )
  );

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await props.params;
  const trip = await getAuthenticatedTrip(tripId);

  if (!trip) {
    return NextResponse.json(
      { error: "旅行が見つかりません" },
      { status: 404 }
    );
  }

  await prisma.travelPlan.deleteMany({ where: { tripId } });

  return NextResponse.json({ success: true });
}
