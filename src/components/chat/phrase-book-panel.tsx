"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PHRASE_CATEGORIES } from "@/data/phrase-book";
import {
  HandMetalIcon,
  UtensilsIcon,
  TrainFrontIcon,
  HotelIcon,
  SirenIcon,
  ShoppingBagIcon,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  "hand-metal": HandMetalIcon,
  utensils: UtensilsIcon,
  "train-front": TrainFrontIcon,
  hotel: HotelIcon,
  siren: SirenIcon,
  "shopping-bag": ShoppingBagIcon,
};

interface PhraseBookPanelProps {
  onSelectPhrase: (text: string) => void;
}

export function PhraseBookPanel({ onSelectPhrase }: PhraseBookPanelProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Tabs defaultValue={PHRASE_CATEGORIES[0].id}>
        <ScrollArea className="px-4">
          <TabsList variant="line" className="w-full justify-start">
            {PHRASE_CATEGORIES.map((cat) => {
              const Icon = ICONS[cat.iconName];
              return (
                <TabsTrigger key={cat.id} value={cat.id} className="gap-1 text-xs">
                  {Icon && <Icon className="size-3.5" />}
                  {cat.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </ScrollArea>

        {PHRASE_CATEGORIES.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-1 p-4">
                {cat.phrases.map((phrase) => (
                  <button
                    key={phrase.id}
                    onClick={() => onSelectPhrase(phrase.text)}
                    className="rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  >
                    {phrase.text}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
