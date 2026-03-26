import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = searchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容が正しくありません" },
      { status: 400 }
    );
  }

  const { query, latitude, longitude } = parsed.data;
  const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps APIキーが設定されていません" },
      { status: 500 }
    );
  }

  // Google Places API (New) - Text Search
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.location,places.rating,places.currentOpeningHours,places.internationalPhoneNumber,places.googleMapsUri,places.priceLevel",
      },
      body: JSON.stringify({
        textQuery: query,
        locationBias: {
          circle: {
            center: { latitude, longitude },
            radius: 5000,
          },
        },
        maxResultCount: 10,
        languageCode: "ja",
      }),
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Places APIの呼び出しに失敗しました" },
      { status: 502 }
    );
  }

  const data = await response.json();

  const places = (data.places ?? []).map(
    (place: {
      displayName?: { text: string };
      formattedAddress?: string;
      location?: { latitude: number; longitude: number };
      rating?: number;
      currentOpeningHours?: { openNow: boolean };
      internationalPhoneNumber?: string;
      googleMapsUri?: string;
      priceLevel?: string;
    }) => ({
      name: place.displayName?.text ?? "",
      address: place.formattedAddress ?? "",
      latitude: place.location?.latitude,
      longitude: place.location?.longitude,
      rating: place.rating,
      isOpen: place.currentOpeningHours?.openNow,
      phone: place.internationalPhoneNumber,
      mapsUrl: place.googleMapsUri,
      priceLevel: place.priceLevel,
    })
  );

  return NextResponse.json({ places });
}
