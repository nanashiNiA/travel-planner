"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  MapIcon,
  BookmarkIcon,
  SettingsIcon,
} from "lucide-react";

const TABS = [
  { href: "/dashboard", icon: HomeIcon, label: "ホーム" },
  { href: "/trips", icon: MapIcon, label: "旅行", matchPrefix: "/trips" },
  { href: "/bookmarks", icon: BookmarkIcon, label: "お気に入り" },
  { href: "/settings/preferences", icon: SettingsIcon, label: "設定" },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-14 items-center justify-around">
        {TABS.map((tab) => {
          const isActive = tab.matchPrefix
            ? pathname.startsWith(tab.matchPrefix)
            : pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="size-5" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
