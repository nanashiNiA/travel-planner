import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlanComparisonView } from "@/components/plans/plan-comparison-view";
import { PlanGenerationDialog } from "@/components/plans/plan-generation-dialog";
import { ArrowLeftIcon, SparklesIcon } from "lucide-react";

export default async function PlansPage(props: {
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
  });
  if (!trip) return notFound();

  const plans = await prisma.travelPlan.findMany({
    where: { tripId },
    include: {
      items: { orderBy: [{ dayNumber: "asc" }, { orderIndex: "asc" }] },
    },
    orderBy: { totalCost: "asc" },
  });

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/trips/${tripId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">プラン提案</h1>
            <p className="text-sm text-muted-foreground">
              {trip.title} — {trip.destination}
            </p>
          </div>
        </div>
        <PlanGenerationDialog
          trip={trip}
          userPreferences={userPreferences}
        />
      </div>

      {/* Plans */}
      {plans.length > 0 ? (
        <PlanComparisonView plans={plans} tripId={tripId} />
      ) : (
        <Card className="py-12 text-center">
          <CardContent className="space-y-4">
            <SparklesIcon className="mx-auto size-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">
                まだプランが生成されていません
              </p>
              <p className="text-sm text-muted-foreground">
                AIが3つのプラン（エコノミー・スタンダード・プレミアム）を提案します
              </p>
            </div>
            <PlanGenerationDialog
              trip={trip}
              userPreferences={userPreferences}
            />
          </CardContent>
        </Card>
      )}

      {/* Settings Link */}
      <p className="text-center text-xs text-muted-foreground">
        <Link href="/settings/preferences" className="underline hover:text-foreground">
          旅行の好み設定
        </Link>
        でプランをよりパーソナライズできます
      </p>
    </div>
  );
}
