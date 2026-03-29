import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { TripContextSetter } from "@/components/chat/trip-context-setter";
import { TripTabs } from "@/components/trip/trip-tabs";
import { resolveCountryCode } from "@/data/destination-countries";
import { getEmergencyContactByCountry } from "@/data/emergency-contacts";
import { getPaymentGuideByCountry } from "@/data/payment-guide";

const statusLabels: Record<string, string> = {
  DRAFT: "下書き",
  PLANNED: "計画済み",
  IN_PROGRESS: "旅行中",
  COMPLETED: "完了",
};

export default async function TripDetailPage(props: {
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
    include: { preference: true },
  });
  if (!dbUser) return notFound();

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: dbUser.id },
    include: {
      tripDays: {
        orderBy: { dayNumber: "asc" },
        include: {
          itineraryItems: { orderBy: { orderIndex: "asc" } },
        },
      },
      budgetCategories: true,
    },
  });
  if (!trip) return notFound();

  const plans = await prisma.travelPlan.findMany({
    where: { tripId },
    include: {
      items: { orderBy: [{ dayNumber: "asc" }, { orderIndex: "asc" }] },
    },
    orderBy: { totalCost: "asc" },
  });

  const totalEstimatedCost = trip.tripDays.reduce(
    (sum, day) =>
      sum +
      day.itineraryItems.reduce(
        (daySum, item) => daySum + (item.estimatedCost ?? 0),
        0
      ),
    0
  );

  // Resolve destination for emergency/currency
  const countryCode = resolveCountryCode(trip.destination);
  const emergencyContact = countryCode
    ? getEmergencyContactByCountry(countryCode) ?? null
    : null;
  const paymentGuide = countryCode
    ? getPaymentGuideByCountry(countryCode) ?? null
    : null;

  // Get default coords from first itinerary item
  const firstItemWithCoords = trip.tripDays
    .flatMap((d) => d.itineraryItems)
    .find((i) => i.latitude && i.longitude);
  const defaultCoords = firstItemWithCoords
    ? { lat: firstItemWithCoords.latitude!, lng: firstItemWithCoords.longitude! }
    : null;

  // User preferences
  const userPreferences = dbUser.preference
    ? {
        accommodationType: dbUser.preference.accommodationType ?? undefined,
        budgetLevel: dbUser.preference.budgetLevel ?? undefined,
        interests: dbUser.preference.interests ?? undefined,
        dietaryRestrictions: dbUser.preference.dietaryRestrictions ?? undefined,
        preferredTransport: dbUser.preference.preferredTransport ?? undefined,
      }
    : null;

  return (
    <div className="space-y-4">
      <TripContextSetter tripId={tripId} />

      {/* Compact Header */}
      <div>
        <h1 className="text-xl font-bold md:text-2xl">{trip.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span>{trip.destination}</span>
          <span>・</span>
          <span>
            {format(new Date(trip.startDate), "M/d", { locale: ja })} -{" "}
            {format(new Date(trip.endDate), "M/d", { locale: ja })}
          </span>
          <Badge variant="secondary" className="text-xs">
            {statusLabels[trip.status]}
          </Badge>
        </div>
      </div>

      {/* Budget Summary - Compact */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">予算</span>
            <span className="font-bold">
              ¥{totalEstimatedCost.toLocaleString()} / ¥{trip.totalBudget.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* All features in tabs - 1 tap to switch */}
      <TripTabs
        trip={trip}
        tripDays={trip.tripDays}
        plans={plans}
        userPreferences={userPreferences}
        emergencyContact={emergencyContact}
        paymentGuide={paymentGuide}
        defaultCoords={defaultCoords}
      />
    </div>
  );
}
