import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { userPreferenceSchema } from "@/validators/preferences";

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
    include: { preference: true },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(dbUser.preference ?? null);
}

export async function PUT(req: Request) {
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

  const body = await req.json();
  const parsed = userPreferenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容が正しくありません", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const preference = await prisma.userPreference.upsert({
    where: { userId: dbUser.id },
    update: parsed.data,
    create: { userId: dbUser.id, ...parsed.data },
  });

  return NextResponse.json(preference);
}
