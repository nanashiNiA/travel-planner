import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookmarkIcon,
  MapPinIcon,
  UtensilsIcon,
  HotelIcon,
  LanguagesIcon,
  MessageSquareIcon,
  NavigationIcon,
  PhoneIcon,
} from "lucide-react";

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  place: { label: "スポット", icon: MapPinIcon, color: "bg-blue-100 text-blue-800" },
  restaurant: { label: "レストラン", icon: UtensilsIcon, color: "bg-orange-100 text-orange-800" },
  hotel: { label: "ホテル", icon: HotelIcon, color: "bg-purple-100 text-purple-800" },
  phrase: { label: "フレーズ", icon: MessageSquareIcon, color: "bg-green-100 text-green-800" },
  translation: { label: "翻訳", icon: LanguagesIcon, color: "bg-cyan-100 text-cyan-800" },
};

export default async function BookmarksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return notFound();

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });
  if (!dbUser) return notFound();

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    include: { trip: { select: { title: true } } },
  });

  const types = ["all", "place", "restaurant", "hotel", "phrase", "translation"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">お気に入り</h1>
        <p className="text-sm text-muted-foreground">
          保存したスポット・レストラン・翻訳など
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList variant="line">
          <TabsTrigger value="all" className="gap-1 text-xs">
            <BookmarkIcon className="size-3.5" />
            すべて ({bookmarks.length})
          </TabsTrigger>
          {types.slice(1).map((type) => {
            const config = TYPE_CONFIG[type];
            const count = bookmarks.filter((b) => b.type === type).length;
            if (count === 0) return null;
            return (
              <TabsTrigger key={type} value={type} className="gap-1 text-xs">
                <config.icon className="size-3.5" />
                {config.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {types.map((type) => {
          const filtered =
            type === "all"
              ? bookmarks
              : bookmarks.filter((b) => b.type === type);

          return (
            <TabsContent key={type} value={type}>
              {filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <BookmarkIcon className="mx-auto mb-2 size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    まだお気に入りがありません
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((bookmark) => {
                    const config = TYPE_CONFIG[bookmark.type] ?? TYPE_CONFIG.place;
                    const Icon = config.icon;

                    return (
                      <Card key={bookmark.id}>
                        <CardContent className="flex items-start gap-3 pt-4">
                          <div
                            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${config.color}`}
                          >
                            <Icon className="size-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{bookmark.title}</p>
                            {bookmark.subtitle && (
                              <p className="text-xs text-muted-foreground">
                                {bookmark.subtitle}
                              </p>
                            )}
                            {bookmark.address && (
                              <p className="truncate text-xs text-muted-foreground">
                                {bookmark.address}
                              </p>
                            )}
                            <div className="mt-1 flex items-center gap-2">
                              {bookmark.trip && (
                                <Badge variant="outline" className="text-xs">
                                  {bookmark.trip.title}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(bookmark.createdAt).toLocaleDateString("ja-JP")}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            {bookmark.mapsUrl && (
                              <a
                                href={bookmark.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs"
                              >
                                <NavigationIcon className="size-3" />
                                地図
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
