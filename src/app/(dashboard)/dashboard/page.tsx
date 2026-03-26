import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

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

  const trips = dbUser
    ? await prisma.trip.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">マイ旅行</h1>
          <p className="text-muted-foreground mt-1">
            あなたの旅行プランを管理しましょう
          </p>
        </div>
        <LinkButton href="/trips/new">新しい旅行を作成</LinkButton>
      </div>

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
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
