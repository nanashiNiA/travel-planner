import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { AiGenerateButton } from "@/components/itinerary/ai-generate-button";
import { ItineraryDayView } from "@/components/itinerary/itinerary-day-view";
import { TripContextSetter } from "@/components/chat/trip-context-setter";
import { EmergencyButton } from "@/components/layout/emergency-button";
import { LinkButton } from "@/components/ui/link-button";

const statusLabels: Record<string, string> = {
  DRAFT: "下書き",
  PLANNED: "計画済み",
  IN_PROGRESS: "旅行中",
  COMPLETED: "完了",
};

const itemTypeLabels: Record<string, string> = {
  ATTRACTION: "観光",
  RESTAURANT: "食事",
  TRANSPORT: "移動",
  ACCOMMODATION: "宿泊",
  ACTIVITY: "体験",
  OTHER: "その他",
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
  });
  if (!dbUser) return notFound();

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: dbUser.id },
    include: {
      tripDays: {
        orderBy: { dayNumber: "asc" },
        include: {
          itineraryItems: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
      budgetCategories: true,
    },
  });

  if (!trip) return notFound();

  const totalEstimatedCost = trip.tripDays.reduce(
    (sum, day) =>
      sum +
      day.itineraryItems.reduce(
        (daySum, item) => daySum + (item.estimatedCost ?? 0),
        0
      ),
    0
  );

  const hasItinerary = trip.tripDays.some(
    (day) => day.itineraryItems.length > 0
  );

  return (
    <div className="space-y-6">
      <TripContextSetter tripId={tripId} />
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{trip.title}</h1>
          <p className="text-muted-foreground mt-1">{trip.destination}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground md:gap-4">
            <span>
              {format(new Date(trip.startDate), "yyyy/MM/dd (E)", {
                locale: ja,
              })}{" "}
              -{" "}
              {format(new Date(trip.endDate), "yyyy/MM/dd (E)", { locale: ja })}
            </span>
            <Badge variant="secondary">{statusLabels[trip.status]}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href={`/trips/${tripId}/plans`} variant="outline" size="sm">
            プラン提案
          </LinkButton>
          <LinkButton href={`/trips/${tripId}/restaurants`} variant="outline" size="sm">
            レストラン
          </LinkButton>
          <LinkButton href={`/trips/${tripId}/currency`} variant="outline" size="sm">
            為替
          </LinkButton>
          <LinkButton href={`/trips/${tripId}/expenses`} variant="outline" size="sm">
            経費
          </LinkButton>
          <EmergencyButton tripId={tripId} />
          <AiGenerateButton trip={trip} />
        </div>
      </div>

      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">予算概要</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">総予算</p>
              <p className="text-2xl font-bold">
                {trip.totalBudget.toLocaleString()}円
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">推定合計</p>
              <p className="text-2xl font-bold">
                {totalEstimatedCost.toLocaleString()}円
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">残り</p>
              <p className="text-2xl font-bold">
                {(trip.totalBudget - totalEstimatedCost).toLocaleString()}円
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary */}
      {!hasItinerary ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">
              まだ旅程がありません。AIで自動生成しましょう。
            </p>
            <AiGenerateButton trip={trip} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {trip.tripDays.map((day) => (
            <ItineraryDayView
              key={day.id}
              day={day}
              itemTypeLabels={itemTypeLabels}
            />
          ))}
        </div>
      )}
    </div>
  );
}
