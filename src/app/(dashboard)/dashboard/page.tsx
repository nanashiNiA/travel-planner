import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import { ja } from "date-fns/locale";
import {
  MapIcon,
  CalendarIcon,
  BookmarkIcon,
  PlaneIcon,
} from "lucide-react";

const statusLabels: Record<string, string> = {
  DRAFT: "下書き",
  PLANNED: "計画済み",
  IN_PROGRESS: "旅行中",
  COMPLETED: "完了",
};

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "secondary",
  PLANNED: "default",
  IN_PROGRESS: "destructive",
  COMPLETED: "outline",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) return null;

  const [trips, bookmarkCount] = await Promise.all([
    prisma.trip.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.bookmark.count({ where: { userId: dbUser.id } }),
  ]);

  // Stats
  const completedTrips = trips.filter((t) => t.status === "COMPLETED").length;
  const destinations = new Set(trips.map((t) => t.destination)).size;

  // Next upcoming trip
  const now = new Date();
  const upcomingTrip = trips
    .filter((t) => new Date(t.startDate) > now && t.status !== "COMPLETED")
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )[0];

  const daysUntilTrip = upcomingTrip
    ? differenceInDays(new Date(upcomingTrip.startDate), now)
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">マイ旅行</h1>
          <p className="text-muted-foreground mt-1">
            あなたの旅行プランを管理しましょう
          </p>
        </div>
        <LinkButton href="/trips/new" className="hidden sm:inline-flex">
          新しい旅行を作成
        </LinkButton>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
              <MapIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{trips.length}</p>
              <p className="text-xs text-muted-foreground">旅行プラン</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-800">
              <PlaneIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedTrips}</p>
              <p className="text-xs text-muted-foreground">完了した旅行</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-800">
              <CalendarIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{destinations}</p>
              <p className="text-xs text-muted-foreground">目的地</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <Link href="/bookmarks" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                <BookmarkIcon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bookmarkCount}</p>
                <p className="text-xs text-muted-foreground">お気に入り</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Next Trip Countdown */}
      {upcomingTrip && daysUntilTrip !== null && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                次の旅行
              </p>
              <p className="text-lg font-bold">{upcomingTrip.title}</p>
              <p className="text-sm text-muted-foreground">
                {upcomingTrip.destination} ・{" "}
                {format(new Date(upcomingTrip.startDate), "M月d日", {
                  locale: ja,
                })}
                出発
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {daysUntilTrip}
              </p>
              <p className="text-xs text-muted-foreground">日後</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trip List */}
      {trips.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">
              まだ旅行プランがありません
            </p>
            <LinkButton href="/trips/new">
              最初の旅行プランを作成
            </LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{trip.title}</CardTitle>
                    <Badge variant={statusVariants[trip.status]}>
                      {statusLabels[trip.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">{trip.destination}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(trip.startDate), "yyyy/MM/dd", {
                      locale: ja,
                    })}{" "}
                    -{" "}
                    {format(new Date(trip.endDate), "yyyy/MM/dd", {
                      locale: ja,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    予算: {trip.totalBudget.toLocaleString()}円
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
