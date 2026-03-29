"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  MenuIcon,
  MapIcon,
  SettingsIcon,
  PlusIcon,
  LogOutIcon,
} from "lucide-react";
import { LogoutButton } from "@/components/layout/logout-button";

interface MobileNavProps {
  email?: string;
}

export function MobileNav({ email }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="メニューを開く"
      >
        <MenuIcon className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle>Travel Planner</SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col">
            {email && (
              <div className="px-4 py-3">
                <p className="truncate text-sm text-muted-foreground">
                  {email}
                </p>
              </div>
            )}

            <Separator />

            <nav className="flex flex-col gap-1 p-2">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <MapIcon className="size-4" />
                マイ旅行
              </Link>
              <Link
                href="/trips/new"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <PlusIcon className="size-4" />
                新しい旅行
              </Link>
              <Link
                href="/settings/preferences"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <SettingsIcon className="size-4" />
                設定
              </Link>
            </nav>

            <Separator />

            <div className="p-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <LogOutIcon className="size-4 text-muted-foreground" />
                <LogoutButton />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
