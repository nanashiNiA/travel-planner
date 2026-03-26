import { LinkButton } from "@/components/ui/link-button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Travel Planner</h1>
          <div className="flex gap-2">
            <LinkButton href="/login" variant="ghost">
              ログイン
            </LinkButton>
            <LinkButton href="/signup">新規登録</LinkButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-24 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            AIで旅行プランを
            <br />
            <span className="text-primary">もっと簡単に</span>
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            目的地・日程・予算を入力するだけで、AIが最適な旅程を自動生成。
            地図上でルートを確認しながら、予算もしっかり管理できます。
          </p>
          <div className="flex gap-4">
            <LinkButton href="/signup" size="lg">
              無料で始める
            </LinkButton>
            <LinkButton href="/login" size="lg" variant="outline">
              ログイン
            </LinkButton>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="mb-12 text-center text-2xl font-bold">主な機能</h3>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                title="AI旅程自動生成"
                description="目的地と日程を入力するだけで、観光スポット・食事・移動手段を含む最適な旅程をAIが提案します。"
              />
              <FeatureCard
                title="地図でルート確認"
                description="Google Mapsと連携し、訪問先やルートを地図上で視覚的に確認。効率的な移動計画を立てられます。"
              />
              <FeatureCard
                title="予算管理"
                description="交通費・宿泊費・食費などをカテゴリ別に管理。予算オーバーを防ぎ、安心して旅行を楽しめます。"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Travel Planner - AI旅行プランナー</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h4 className="mb-2 text-lg font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
