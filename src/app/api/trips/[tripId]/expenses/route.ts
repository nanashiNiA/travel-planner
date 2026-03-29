import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createExpenseSchema } from "@/validators/expense";

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
    return NextResponse.json({ error: "旅行が見つかりません" }, { status: 404 });
  }

  const expenses = await prisma.expense.findMany({
    where: { tripId },
    orderBy: { createdAt: "desc" },
    include: {
      itineraryItem: { select: { title: true } },
    },
  });

  return NextResponse.json(expenses);
}

export async function POST(
  req: Request,
  props: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await props.params;
  const trip = await getAuthenticatedTrip(tripId);

  if (!trip) {
    return NextResponse.json({ error: "旅行が見つかりません" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = createExpenseSchema.safeParse({ ...body, tripId });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容が正しくありません", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const expense = await prisma.expense.create({
    data: {
      tripId,
      category: parsed.data.category,
      title: parsed.data.title,
      amount: parsed.data.amount,
      originalAmount: parsed.data.originalAmount,
      originalCurrency: parsed.data.originalCurrency,
      itineraryItemId: parsed.data.itineraryItemId,
      paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : null,
    },
  });

  return NextResponse.json(expense, { status: 201 });
}
