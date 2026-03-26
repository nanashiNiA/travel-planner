import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { RestaurantSearch } from "@/components/restaurant/restaurant-search";
import { ArrowLeftIcon } from "lucide-react";

export default async function RestaurantsPage(props: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return notFound();

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });
  if (!dbUser) return notFound();

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: dbUser.id },
    include: {
      tripDays: {
        include: {
          itineraryItems: {
            where: { latitude: { not: null } },
            take: 1,
          },
        },
        take: 1,
      },
    },
  });
  if (!trip) return notFound();

  // Get approximate coords from first itinerary item if available
  const firstItem = trip.tripDays[0]?.itineraryItems[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/trips/${tripId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">レストラン検索</h1>
          <p className="text-sm text-muted-foreground">
            {trip.title} — {trip.destination}
          </p>
        </div>
      </div>

      <RestaurantSearch
        destination={trip.destination}
        defaultLatitude={firstItem?.latitude ?? undefined}
        defaultLongitude={firstItem?.longitude ?? undefined}
      />
    </div>
  );
}
