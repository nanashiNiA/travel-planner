import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Free exchange rate API (no key required)
const EXCHANGE_API_URL = "https://open.er-api.com/v6/latest";

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const base = searchParams.get("base") ?? "JPY";

  const response = await fetch(`${EXCHANGE_API_URL}/${base}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "為替レートの取得に失敗しました" },
      { status: 502 }
    );
  }

  const data = await response.json();

  return NextResponse.json({
    base: data.base_code,
    rates: data.rates,
    lastUpdated: data.time_last_update_utc,
  });
}
