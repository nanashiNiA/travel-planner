import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { insuranceInfoSchema } from "@/validators/insurance";

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

  return NextResponse.json({ insuranceInfo: trip.insuranceInfo ?? null });
}

export async function PUT(
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

  const body = await req.json();
  const parsed = insuranceInfoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容が正しくありません", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: { insuranceInfo: parsed.data },
  });

  return NextResponse.json({ success: true });
}
