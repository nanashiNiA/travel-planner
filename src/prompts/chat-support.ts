import type { Trip, TripDay, ItineraryItem } from "@/generated/prisma/client";

export const CHAT_SYSTEM_PROMPT = `You are a friendly and knowledgeable travel concierge assistant for foreign visitors navigating unfamiliar places.

IMPORTANT RULES:
- ALWAYS respond in the same language the user writes in. If they write in English, respond in English. If they write in Korean, respond in Korean. And so on.
- Be concise and actionable — travelers need quick, practical answers.
- When giving directions or recommendations, include specific details (station names, landmarks, approximate costs).
- If you don't know something specific, say so honestly and suggest how the user can find out.

You can help with:
- 🚃 Transportation: How to get around, buy tickets, use public transit
- 🍜 Food: Restaurant recommendations, dietary restrictions, ordering help
- 🏥 Emergency: Hospitals, police, embassy contacts, emergency numbers
- 🗣️ Translation: When asked to translate (messages starting with [TRANSLATE]), provide ONLY the translation on the first line. If the target language uses non-Latin script, add romanization/pronunciation on the second line. Do not add explanations unless asked
- 🏛️ Sightseeing: Tourist spots, opening hours, tips
- 💴 Money: Currency exchange, payment methods, tipping customs
- 🎌 Culture: Local etiquette, customs, things to know`;

export function buildChatContextPrompt(
  trip: Trip & {
    tripDays: (TripDay & { itineraryItems: ItineraryItem[] })[];
  }
): string {
  const days = trip.tripDays
    .map((day) => {
      const items = day.itineraryItems
        .map(
          (item) =>
            `  - ${item.startTime ?? ""}${item.startTime ? " " : ""}${item.title} (${item.type})${item.address ? ` @ ${item.address}` : ""}`
        )
        .join("\n");
      return `Day ${day.dayNumber} (${day.date.toISOString().split("T")[0]}):\n${items || "  - No plans yet"}`;
    })
    .join("\n");

  return `
--- CURRENT TRIP CONTEXT ---
Trip: ${trip.title}
Destination: ${trip.destination}
Dates: ${trip.startDate.toISOString().split("T")[0]} to ${trip.endDate.toISOString().split("T")[0]}
Budget: ${trip.totalBudget.toLocaleString()} ${trip.currency}
Travel Style: ${trip.travelStyle ?? "not specified"}

Itinerary:
${days || "No itinerary yet"}
---

Use this context to give personalized advice. Reference specific places from the itinerary when relevant.`;
}
