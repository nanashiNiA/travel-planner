import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { directionsRequestSchema } from "@/validators/directions";
import type { DirectionsResponse, DirectionsStep } from "@/types/directions";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = directionsRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容が正しくありません", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { origin, destination, mode } = parsed.data;
  const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps APIキーが設定されていません" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    origin: `${origin.latitude},${origin.longitude}`,
    destination: `${destination.latitude},${destination.longitude}`,
    mode: mode.toLowerCase(),
    language: "ja",
    alternatives: "false",
    key: apiKey,
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?${params}`
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Directions APIの呼び出しに失敗しました" },
      { status: 502 }
    );
  }

  const data = await response.json();

  if (data.status !== "OK" || !data.routes?.length) {
    return NextResponse.json(
      { error: `ルートが見つかりませんでした (${data.status})` },
      { status: 404 }
    );
  }

  const route = data.routes[0];
  const leg = route.legs[0];

  const steps: DirectionsStep[] = (leg.steps ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (step: any) => {
      const base: DirectionsStep = {
        instruction: step.html_instructions ?? "",
        distance: step.distance?.text ?? "",
        duration: step.duration?.text ?? "",
        travelMode: step.travel_mode ?? "",
      };

      if (step.transit_details) {
        const td = step.transit_details;
        base.transitDetails = {
          lineName: td.line?.name ?? "",
          lineShortName: td.line?.short_name ?? "",
          vehicleType: td.line?.vehicle?.type ?? "",
          departureStop: td.departure_stop?.name ?? "",
          arrivalStop: td.arrival_stop?.name ?? "",
          departureTime: td.departure_time?.text ?? "",
          arrivalTime: td.arrival_time?.text ?? "",
          numStops: td.num_stops ?? 0,
          lineColor: td.line?.color,
        };
      }

      return base;
    }
  );

  const result: DirectionsResponse = {
    summary: route.summary ?? "",
    duration: leg.duration?.text ?? "",
    durationValue: leg.duration?.value ?? 0,
    distance: leg.distance?.text ?? "",
    distanceValue: leg.distance?.value ?? 0,
    startAddress: leg.start_address ?? "",
    endAddress: leg.end_address ?? "",
    steps,
    overviewPolyline: route.overview_polyline?.points ?? "",
  };

  return NextResponse.json(result);
}
