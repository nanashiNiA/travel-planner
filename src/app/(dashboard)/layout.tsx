import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LinkButton } from "@/components/ui/link-button";
import { LogoutButton } from "@/components/layout/logout-button";
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
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold">
              Travel Planner
            </Link>
            <nav className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                マイ旅行
              </Link>
              <Link
                href="/settings/preferences"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                設定
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <LinkButton href="/trips/new">新しい旅行</LinkButton>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <ChatFab />
    </div>
  );
}
