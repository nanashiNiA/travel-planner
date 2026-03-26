"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowRightLeftIcon } from "lucide-react";

interface Alternative {
  title: string;
  description?: string;
  estimatedCost: number;
  address?: string;
}

interface PlanItemSwapProps {
  itemId: string;
  currentCost: number;
  alternatives: Alternative[];
  planId: string;
  onSwap: (itemId: string, alternativeIndex: number) => void;
}

export function PlanItemSwap({
  itemId,
  currentCost,
  alternatives,
  onSwap,
}: PlanItemSwapProps) {
  const [open, setOpen] = useState(false);

  function handleSwap(index: number) {
    onSwap(itemId, index);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon-xs" title="代替案を表示" />
        }
      >
        <ArrowRightLeftIcon className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          代替案
        </p>
        <div className="space-y-2">
          {alternatives.map((alt, i) => {
            const diff = alt.estimatedCost - currentCost;
            return (
              <button
                key={i}
                onClick={() => handleSwap(i)}
                className="w-full rounded-md border p-2 text-left text-sm transition-colors hover:bg-accent"
              >
                <p className="font-medium">{alt.title}</p>
                {alt.description && (
                  <p className="text-xs text-muted-foreground">
                    {alt.description}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span>¥{alt.estimatedCost.toLocaleString()}</span>
                  {diff !== 0 && (
                    <span
                      className={
                        diff > 0 ? "text-red-600" : "text-green-600"
                      }
                    >
                      ({diff > 0 ? "+" : ""}
                      {diff.toLocaleString()}円)
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
