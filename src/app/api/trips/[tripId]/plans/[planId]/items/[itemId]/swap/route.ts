import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { swapPlanItemSchema } from "@/validators/plan";
import type { PlanAlternative } from "@/types/plan";

export async function POST(
  req: Request,
  props: {
    params: Promise<{ tripId: string; planId: string; itemId: string }>;
  }
) {
  const { tripId, planId, itemId } = await props.params;

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

  // Verify ownership
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: dbUser.id },
  });
  if (!trip) {
    return NextResponse.json({ error: "旅行が見つかりません" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = swapPlanItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容が正しくありません" },
      { status: 400 }
    );
  }

  const item = await prisma.travelPlanItem.findFirst({
    where: { id: itemId, travelPlanId: planId },
  });
  if (!item) {
    return NextResponse.json(
      { error: "アイテムが見つかりません" },
      { status: 404 }
    );
  }

  const alternatives = (item.alternatives ?? []) as unknown as PlanAlternative[];
  const alt = alternatives[parsed.data.alternativeIndex];
  if (!alt) {
    return NextResponse.json(
      { error: "代替案が見つかりません" },
      { status: 400 }
    );
  }

  // Save current item as an alternative before swapping
  const currentAsAlt: PlanAlternative = {
    title: item.title,
    description: item.description ?? undefined,
    estimatedCost: item.estimatedCost,
    address: item.address ?? undefined,
    latitude: item.latitude ?? undefined,
    longitude: item.longitude ?? undefined,
    bookingUrl: item.bookingUrl ?? undefined,
  };

  const newAlternatives = alternatives
    .filter((_, i) => i !== parsed.data.alternativeIndex)
    .concat(currentAsAlt);

  const costDiff = alt.estimatedCost - item.estimatedCost;

  // Update item with alternative data
  await prisma.travelPlanItem.update({
    where: { id: itemId },
    data: {
      title: alt.title,
      description: alt.description,
      estimatedCost: alt.estimatedCost,
      address: alt.address,
      latitude: alt.latitude,
      longitude: alt.longitude,
      bookingUrl: alt.bookingUrl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alternatives: newAlternatives as any,
      isCustomized: true,
    },
  });

  // Recalculate total cost
  if (costDiff !== 0) {
    await prisma.travelPlan.update({
      where: { id: planId },
      data: { totalCost: { increment: costDiff } },
    });
  }

  return NextResponse.json({ success: true });
}
