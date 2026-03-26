# AIチャットサポート設計メモ

Issue: [#1](https://github.com/nanashiNiA/travel-planner/issues/1)

## 概要
海外旅行者が母国語でリアルタイムに相談できるAIチャット機能。ダッシュボードのどのページからでもアクセス可能。

## 設計方針

### UI
- **Sheet（右サイドバー）** を右下のフローティングボタンから開く
- ダッシュボード全ページ共通（`(dashboard)/layout.tsx` に配置）
- クイックアクション: 「交通」「周辺の食事」「緊急」「翻訳」のバッジボタン

### 多言語対応
- 追加ライブラリ不要 — AIがユーザーの言語を自動検出して同じ言語で返答
- システムプロンプトで「ユーザーの言語で必ず返答する」と指示

### 旅行コンテキスト
- 旅行詳細ページ閲覧時、Zustandストア経由で `activeTripId` をチャットに渡す
- APIルートで Trip + ItineraryItem を取得しシステムプロンプトに注入

### ストリーミング
- クライアント: AI SDK `useChat` フック（`ai/react`）
- サーバー: `streamText()` → `toDataStreamResponse()`

### 会話永続化
- `ChatConversation` + `ChatMessage` モデル（Prisma）
- 新規会話作成時、レスポンスヘッダー `X-Conversation-Id` でIDを返す
- `useChat` は毎回全履歴を送信 → APIでは最新のユーザーメッセージのみDB保存
- アシスタント返答は `onFinish` コールバックで保存

## ファイル構成

```
src/
├── app/api/ai/chat/
│   ├── route.ts              # チャットストリーミングAPI
│   └── history/route.ts      # 会話履歴取得API
├── components/chat/
│   ├── chat-fab.tsx           # フローティングボタン + Sheet
│   ├── chat-panel.tsx         # メインチャットUI (useChat)
│   ├── chat-message.tsx       # メッセージバブル
│   ├── conversation-list.tsx  # 過去の会話一覧
│   └── trip-context-setter.tsx # tripId同期
├── prompts/
│   └── chat-support.ts        # システムプロンプト
├── stores/
│   └── chat-store.ts          # チャット状態管理
└── validators/
    └── chat.ts                # Zodスキーマ
```

## 実装状況

- [x] Prismaスキーマ（ChatConversation, ChatMessage）
- [x] プロンプト + バリデーター
- [x] APIルート（`/api/ai/chat`, `/api/ai/chat/history`）
- [x] Zustandストア（`chat-store.ts`）
- [x] UIコンポーネント（chat-fab, chat-panel, chat-message, conversation-list, trip-context-setter）
- [x] レイアウト統合（dashboard layout + trip detail page）
- [x] ビルド通過確認

## 技術的な注意点（実装で判明）

- AI SDK v6では`useChat`が`@ai-sdk/react`に移動
- `UIMessage`は`content`ではなく`parts`ベースの構造
- サーバー側は`toUIMessageStreamResponse()`を使用（v5の`toDataStreamResponse()`ではない）
- `DefaultChatTransport`でAPIエンドポイントとbodyを設定
- `sendMessage({ text })`でメッセージ送信（v5の`handleSubmit`パターンではない）
