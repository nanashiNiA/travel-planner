import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ExpenseList } from "@/components/expense/expense-list";
import { ArrowLeftIcon } from "lucide-react";

export default async function ExpensesPage(props: {
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
  });
  if (!trip) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/trips/${tripId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">経費管理</h1>
          <p className="text-sm text-muted-foreground">
            {trip.title} — {trip.destination}
          </p>
        </div>
      </div>

      <ExpenseList tripId={tripId} totalBudget={trip.totalBudget} />
    </div>
  );
}
