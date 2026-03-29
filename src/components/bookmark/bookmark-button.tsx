"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookmarkIcon, BookmarkCheckIcon, Loader2Icon } from "lucide-react";

interface BookmarkButtonProps {
  type: "place" | "restaurant" | "hotel" | "phrase" | "translation";
  title: string;
  subtitle?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
  metadata?: Record<string, unknown>;
  tripId?: string;
  size?: "default" | "sm" | "xs" | "icon" | "icon-xs" | "icon-sm";
  variant?: "ghost" | "outline" | "secondary";
}

export function BookmarkButton({
  type,
  title,
  subtitle,
  address,
  latitude,
  longitude,
  mapsUrl,
  metadata,
  tripId,
  size = "icon-xs",
  variant = "ghost",
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleBookmark() {
    if (saved) return;
    setLoading(true);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          subtitle,
          address,
          latitude,
          longitude,
          mapsUrl,
          metadata,
          tripId,
        }),
      });

      if (res.ok) {
        setSaved(true);
        toast.success("お気に入りに追加しました");
      } else {
        toast.error("保存に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBookmark}
      disabled={loading || saved}
      title={saved ? "保存済み" : "お気に入りに追加"}
    >
      {loading ? (
        <Loader2Icon className="size-3.5 animate-spin" />
      ) : saved ? (
        <BookmarkCheckIcon className="size-3.5 text-primary" />
      ) : (
        <BookmarkIcon className="size-3.5" />
      )}
    </Button>
  );
}
