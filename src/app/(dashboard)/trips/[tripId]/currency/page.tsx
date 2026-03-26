import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CurrencyConverter } from "@/components/currency/currency-converter";
import { PaymentGuideCard } from "@/components/currency/payment-guide-card";
import { resolveCountryCode } from "@/data/destination-countries";
import { getPaymentGuideByCountry } from "@/data/payment-guide";
import { ArrowLeftIcon } from "lucide-react";

export default async function CurrencyPage(props: {
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

  const countryCode = resolveCountryCode(trip.destination);
  const guide = countryCode ? getPaymentGuideByCountry(countryCode) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/trips/${tripId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">為替・支払いガイド</h1>
          <p className="text-sm text-muted-foreground">
            {trip.title} — {trip.destination}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CurrencyConverter
          defaultTargetCurrency={guide?.currencyCode ?? "USD"}
        />
        {guide && <PaymentGuideCard guide={guide} />}
      </div>

      {!guide && (
        <p className="text-center text-sm text-muted-foreground">
          この目的地の支払いガイドはまだ用意されていません。
        </p>
      )}
    </div>
  );
}
