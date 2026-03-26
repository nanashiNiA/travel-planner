import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { resolveCountryCode } from "@/data/destination-countries";
import { getEmergencyContactByCountry } from "@/data/emergency-contacts";
import { EmergencyContactsTab } from "@/components/emergency/emergency-contacts-tab";
import { CountrySelector } from "@/components/emergency/country-selector";
import { NearbyHospitalsTab } from "@/components/emergency/nearby-hospitals-tab";
import { InsuranceInfoTab } from "@/components/emergency/insurance-info-tab";
import {
  ArrowLeftIcon,
  PhoneCallIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "lucide-react";

export default async function EmergencyPage(props: {
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
  const contact = countryCode
    ? getEmergencyContactByCountry(countryCode)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/trips/${tripId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">緊急情報</h1>
          <p className="text-sm text-muted-foreground">
            {trip.title} — {trip.destination}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts" className="gap-1.5">
            <PhoneCallIcon className="size-4" />
            緊急連絡先
          </TabsTrigger>
          <TabsTrigger value="hospitals" className="gap-1.5">
            <MapPinIcon className="size-4" />
            周辺の病院
          </TabsTrigger>
          <TabsTrigger value="insurance" className="gap-1.5">
            <ShieldCheckIcon className="size-4" />
            保険情報
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          {contact ? (
            <EmergencyContactsTab contact={contact} />
          ) : (
            <CountrySelector />
          )}
        </TabsContent>

        <TabsContent value="hospitals">
          <NearbyHospitalsTab />
        </TabsContent>

        <TabsContent value="insurance">
          <InsuranceInfoTab tripId={tripId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
