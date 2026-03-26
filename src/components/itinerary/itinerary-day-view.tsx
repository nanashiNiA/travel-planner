import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { TripDay, ItineraryItem } from "@/generated/prisma/client";

interface ItineraryDayViewProps {
  day: TripDay & { itineraryItems: ItineraryItem[] };
  itemTypeLabels: Record<string, string>;
}

const typeColors: Record<string, string> = {
  ATTRACTION: "bg-blue-100 text-blue-800",
  RESTAURANT: "bg-orange-100 text-orange-800",
  TRANSPORT: "bg-green-100 text-green-800",
  ACCOMMODATION: "bg-purple-100 text-purple-800",
  ACTIVITY: "bg-yellow-100 text-yellow-800",
  OTHER: "bg-gray-100 text-gray-800",
};

export function ItineraryDayView({
  day,
  itemTypeLabels,
}: ItineraryDayViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Day {day.dayNumber} -{" "}
          {format(new Date(day.date), "M/d (E)", { locale: ja })}
        </CardTitle>
        {day.memo && (
          <p className="text-sm text-muted-foreground">{day.memo}</p>
        )}
      </CardHeader>
      <CardContent>
        {day.itineraryItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            この日の予定はまだありません
          </p>
        ) : (
          <div className="space-y-4">
            {day.itineraryItems.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex gap-4">
                  <div className="w-16 shrink-0 text-sm text-muted-foreground">
                    {item.startTime && (
                      <p className="font-medium">{item.startTime}</p>
                    )}
                    {item.endTime && <p>{item.endTime}</p>}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{item.title}</h4>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[item.type] ?? typeColors.OTHER}`}
                      >
                        {itemTypeLabels[item.type] ?? item.type}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    {item.address && (
                      <p className="text-xs text-muted-foreground">
                        {item.address}
                      </p>
                    )}
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {item.estimatedCost != null && item.estimatedCost > 0 && (
                        <span>
                          {item.estimatedCost.toLocaleString()}円
                        </span>
                      )}
                      {item.notes && <span>{item.notes}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
