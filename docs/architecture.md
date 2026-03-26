# アーキテクチャ

## システム構成

```
[Client Browser]
    ↓ HTTPS
[Next.js 16 App Router]
    ├── Server Components (SSR)
    ├── API Routes (/api/*)
    ├── Middleware (Supabase Auth)
    ↓
[Supabase]
    ├── Auth (認証・セッション管理)
    └── PostgreSQL (データベース)
    ↓
[External APIs]
    ├── OpenAI API (AI機能)
    └── Google Maps API (地図・場所検索)
```

## 認証フロー

1. ユーザーがログイン/サインアップ
2. Supabase Auth がセッション発行
3. `src/proxy.ts` (middleware) が全リクエストでセッション検証
4. 未認証 → `/login` にリダイレクト
5. Server Components は `createClient().auth.getUser()` でユーザー取得
6. API Routes も同様にSupabaseでユーザー認証

## データモデル

### コアモデル
- **User** — Supabase Auth と連携したユーザー（supabaseId でリンク）
- **Trip** — 旅行プラン（目的地、期間、予算、スタイル）
- **TripDay** — 旅行の各日（Trip に紐づく）
- **ItineraryItem** — 旅程アイテム（観光地、レストラン、移動等）
- **Expense** — 実績支出（ItineraryItem に紐づく）
- **BudgetCategory** — カテゴリ別予算配分
- **TripShare** — 旅行共有（トークンベース）

### チャットモデル
- **ChatConversation** — チャット会話（User, Trip に紐づく）
- **ChatMessage** — 会話内のメッセージ（role: user/assistant/system）

## AI連携

### 旅程生成 (`/api/ai/generate`)
- AI SDK `streamText()` + OpenAI gpt-4o-mini
- システムプロンプトで旅行プランナーとして振る舞う
- JSON形式で日別旅程を生成

### AIチャットサポート (`/api/ai/chat`)
- AI SDK `useChat` フック（クライアント）+ `streamText` + `toDataStreamResponse`（サーバー）
- 旅行コンテキストをシステムプロンプトに注入
- 多言語対応（ユーザーの言語を自動検出して同じ言語で返答）
- 会話履歴をDBに永続化

## 状態管理

- **サーバー**: Prisma経由でDB直接アクセス（Server Components）
- **クライアント**: Zustand stores
  - `trip-store.ts` — 旅行リストのキャッシュ
  - `chat-store.ts` — チャット状態（activeTripId, conversationId, isOpen）
