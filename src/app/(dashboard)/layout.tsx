import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LinkButton } from "@/components/ui/link-button";
import { LogoutButton } from "@/components/layout/logout-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { ChatFab } from "@/components/chat/chat-fab";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:h-16">
          <div className="flex items-center gap-3 md:gap-6">
            <MobileNav email={user?.email ?? undefined} />
            <Link href="/dashboard" className="text-lg font-bold md:text-xl">
              Travel Planner
            </Link>
            <nav className="hidden gap-4 md:flex">
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                マイ旅行
              </Link>
              <Link
                href="/bookmarks"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                お気に入り
              </Link>
              <Link
                href="/settings/preferences"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                設定
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user?.email}
            </span>
            <LinkButton href="/trips/new" size="sm" className="hidden sm:inline-flex">
              新しい旅行
            </LinkButton>
            <div className="hidden md:block">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-4 pb-20 md:py-8 md:pb-8">
        {children}
      </main>
      <BottomTabBar />
      <ChatFab />
    </div>
  );
}
