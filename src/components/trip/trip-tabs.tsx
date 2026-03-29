"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItineraryDayView } from "@/components/itinerary/itinerary-day-view";
import { AiGenerateButton } from "@/components/itinerary/ai-generate-button";
import { PlanComparisonView } from "@/components/plans/plan-comparison-view";
import { PlanGenerationDialog } from "@/components/plans/plan-generation-dialog";
import { RestaurantSearch } from "@/components/restaurant/restaurant-search";
import { ExpenseList } from "@/components/expense/expense-list";
import { CurrencyConverter } from "@/components/currency/currency-converter";
import { PaymentGuideCard } from "@/components/currency/payment-guide-card";
import { EmergencyContactsTab } from "@/components/emergency/emergency-contacts-tab";
import { CountrySelector } from "@/components/emergency/country-selector";
import { NearbyHospitalsTab } from "@/components/emergency/nearby-hospitals-tab";
import { InsuranceInfoTab } from "@/components/emergency/insurance-info-tab";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  SparklesIcon,
  UtensilsIcon,
  WalletIcon,
  WrenchIcon,
} from "lucide-react";
import type { Trip, TripDay, ItineraryItem } from "@/generated/prisma/client";
import type { TravelPlanWithItems } from "@/types/plan";
import type { EmergencyContact as EmergencyContactType } from "@/data/emergency-contacts";
import type { PaymentGuide } from "@/data/payment-guide";

const itemTypeLabels: Record<string, string> = {
  ATTRACTION: "観光",
  RESTAURANT: "食事",
  TRANSPORT: "移動",
  ACCOMMODATION: "宿泊",
  ACTIVITY: "体験",
  OTHER: "その他",
};

interface TripTabsProps {
  trip: Trip;
  tripDays: (TripDay & { itineraryItems: ItineraryItem[] })[];
  plans: TravelPlanWithItems[];
  userPreferences?: {
    accommodationType?: string;
    budgetLevel?: string;
    interests?: string[];
    dietaryRestrictions?: string;
    preferredTransport?: string;
  } | null;
  emergencyContact: EmergencyContactType | null;
  paymentGuide: PaymentGuide | null;
  defaultCoords?: { lat: number; lng: number } | null;
}

export function TripTabs({
  trip,
  tripDays,
  plans,
  userPreferences,
  emergencyContact,
  paymentGuide,
  defaultCoords,
}: TripTabsProps) {
  const hasItinerary = tripDays.some((day) => day.itineraryItems.length > 0);

  return (
    <Tabs defaultValue="itinerary">
      {/* Tab bar - horizontal scroll on mobile */}
      <ScrollArea className="-mx-4 px-4">
        <TabsList variant="line" className="w-full justify-start">
          <TabsTrigger value="itinerary" className="gap-1 text-xs sm:text-sm">
            <CalendarIcon className="size-4" />
            <span className="hidden sm:inline">旅程</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-1 text-xs sm:text-sm">
            <SparklesIcon className="size-4" />
            <span className="hidden sm:inline">プラン</span>
          </TabsTrigger>
          <TabsTrigger value="restaurant" className="gap-1 text-xs sm:text-sm">
            <UtensilsIcon className="size-4" />
            <span className="hidden sm:inline">レストラン</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-1 text-xs sm:text-sm">
            <WalletIcon className="size-4" />
            <span className="hidden sm:inline">経費</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="gap-1 text-xs sm:text-sm">
            <WrenchIcon className="size-4" />
            <span className="hidden sm:inline">ツール</span>
          </TabsTrigger>
        </TabsList>
      </ScrollArea>

      {/* 旅程タブ */}
      <TabsContent value="itinerary">
        {!hasItinerary ? (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                まだ旅程がありません。AIで自動生成しましょう。
              </p>
              <AiGenerateButton trip={trip} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {tripDays.map((day) => (
              <ItineraryDayView
                key={day.id}
                day={day}
                itemTypeLabels={itemTypeLabels}
              />
            ))}
          </div>
        )}
      </TabsContent>

      {/* プランタブ */}
      <TabsContent value="plans">
        {plans.length > 0 ? (
          <PlanComparisonView plans={plans} tripId={trip.id} />
        ) : (
          <Card className="py-12 text-center">
            <CardContent className="space-y-4">
              <SparklesIcon className="mx-auto size-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                AIが3つのプランを提案します
              </p>
              <PlanGenerationDialog
                trip={trip}
                userPreferences={userPreferences}
              />
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* レストランタブ */}
      <TabsContent value="restaurant">
        <RestaurantSearch
          destination={trip.destination}
          defaultLatitude={defaultCoords?.lat}
          defaultLongitude={defaultCoords?.lng}
        />
      </TabsContent>

      {/* 経費タブ */}
      <TabsContent value="expenses">
        <ExpenseList tripId={trip.id} totalBudget={trip.totalBudget} />
      </TabsContent>

      {/* ツールタブ（為替 + 緊急 + 保険） */}
      <TabsContent value="tools">
        <div className="space-y-6">
          {/* 為替 */}
          <CurrencyConverter
            defaultTargetCurrency={paymentGuide?.currencyCode ?? "USD"}
          />
          {paymentGuide && <PaymentGuideCard guide={paymentGuide} />}

          {/* 緊急連絡先 */}
          <div>
            <h3 className="mb-3 text-lg font-bold">緊急連絡先</h3>
            {emergencyContact ? (
              <EmergencyContactsTab contact={emergencyContact} />
            ) : (
              <CountrySelector />
            )}
          </div>

          {/* 病院検索 */}
          <div>
            <h3 className="mb-3 text-lg font-bold">周辺の病院</h3>
            <NearbyHospitalsTab />
          </div>

          {/* 保険情報 */}
          <InsuranceInfoTab tripId={trip.id} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
