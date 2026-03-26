@AGENTS.md

# Travel Planner - プロジェクト概要

海外旅行者が知らない土地で困ることを全て解決するオールインワン旅行プランナーアプリ。

## 技術スタック

- **フレームワーク**: Next.js 16.2.1 (App Router, Turbopack)
- **言語**: TypeScript 5
- **UI**: React 19, Base UI (@base-ui/react), shadcn スタイル, Tailwind CSS 4
- **認証**: Supabase Auth (SSR, OAuth Google対応)
- **DB**: PostgreSQL (Supabase), Prisma 7.5.0 ORM
- **AI**: AI SDK v6 + OpenAI (gpt-4o-mini)
- **状態管理**: Zustand
- **フォーム**: React Hook Form + Zod バリデーション
- **地図**: @vis.gl/react-google-maps (Google Maps JavaScript API)
- **その他**: date-fns, Lucide icons, Sonner (toast), Recharts

## ディレクトリ構成

```
src/
├── app/
│   ├── (auth)/          # 認証ページ (login, signup)
│   ├── (dashboard)/     # ダッシュボード (trips, dashboard)
│   ├── api/             # APIルート (trips, ai/generate, ai/chat)
│   └── auth/            # OAuth callback
├── components/
│   ├── chat/            # AIチャットサポート + 翻訳
│   ├── emergency/       # 緊急連絡先・病院検索
│   ├── itinerary/       # 旅程関連
│   ├── layout/          # レイアウト部品
│   └── ui/              # UIコンポーネント (Base UI wrapper)
├── data/
│   ├── languages.ts     # 翻訳対応言語マスターデータ
│   └── phrase-book.ts   # カテゴリ別フレーズ集
├── hooks/
│   ├── use-speech-recognition.ts  # 音声入力フック
│   └── use-speech-synthesis.ts    # 読み上げフック
├── lib/
│   ├── supabase/        # Supabase client (server/client/middleware)
│   ├── prisma.ts        # Prisma client singleton
│   └── utils.ts         # cn() ユーティリティ
├── prompts/             # AIプロンプト定義
├── stores/              # Zustand stores
├── types/               # 型定義（+ speech.d.ts）
└── validators/          # Zod スキーマ
prisma/
└── schema.prisma        # DBスキーマ
docs/
├── requirements.md      # 機能要件一覧
├── architecture.md      # アーキテクチャ詳細
├── chat-support.md      # AIチャット設計メモ
├── translation.md       # 翻訳機能設計メモ
└── emergency.md         # 緊急連絡先・病院検索設計メモ
```

## 開発ルール

### ドキュメント更新ルール
- **機能追加・変更時**: 関連する `docs/` 配下のドキュメントを必ず更新する
- **スキーマ変更時**: `docs/architecture.md` のデータモデルセクションを更新する
- **新機能の設計メモ**: `docs/` に個別のmdファイルを作成する
- **CLAUDE.md**: ディレクトリ構成や技術スタックに変更があった場合は即座に更新する
- **要件変更時**: `docs/requirements.md` を更新し、対応するGitHub Issueも同期する

### コーディング規約
- Server Component をデフォルトとし、インタラクティブな部分のみ `"use client"`
- APIルートは Zod でリクエストバリデーション
- Prisma モデルは `@@map()` でスネークケースのテーブル名を使用
- UIコンポーネントは Base UI をラップした shadcn スタイル
- AI SDK の `streamText` / `useChat` を使用したストリーミング対応

### 環境変数 (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase認証
- `DATABASE_URL` — PostgreSQL接続
- `OPENAI_API_KEY` — AI機能
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` / `GOOGLE_MAPS_SERVER_KEY` — 地図機能

## GitHub
- リポジトリ: https://github.com/nanashiNiA/travel-planner
- Issues: #1〜#7 で機能要件を管理
