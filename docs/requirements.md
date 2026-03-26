# 機能要件一覧

## ビジョン
海外から来た旅行者が知らない土地で困ることを全て解決するオールインワンアプリ。

## 既存機能（実装済み）

| 機能 | 状態 | 概要 |
|------|------|------|
| 認証 | 実装済み | Supabase Auth（メール/パスワード、Google OAuth） |
| 旅行CRUD | 実装済み | 旅行の作成・一覧・詳細表示 |
| AI旅程生成 | 実装済み | OpenAI gpt-4o-miniによる旅程自動生成 |
| 旅程表示 | 実装済み | 日別の旅程アイテム表示 |
| 経費バリデーション | 実装済み | Zodスキーマ定義 |

## 新規機能（開発中・計画中）

### 優先度: 高

| # | 機能 | Issue | 状態 | 概要 |
|---|------|-------|------|------|
| 1 | AIチャットサポート（多言語対応） | [#1](https://github.com/nanashiNiA/travel-planner/issues/1) | 完了 | 母国語で質問できるAIチャット |
| 2 | リアルタイム翻訳 | [#2](https://github.com/nanashiNiA/travel-planner/issues/2) | 完了 | テキスト翻訳・音声入出力・フレーズ集（カメラOCR後回し） |
| 3 | 緊急連絡先・病院検索 | [#3](https://github.com/nanashiNiA/travel-planner/issues/3) | 完了 | 国別緊急連絡先、最寄り病院検索、保険情報管理 |
| 4 | ルート案内・交通ガイド | [#4](https://github.com/nanashiNiA/travel-planner/issues/4) | 完了 | Google Directions API、日別ルートマップ、公共交通乗換案内 |

### 優先度: 中

| # | 機能 | Issue | 状態 | 概要 |
|---|------|-------|------|------|
| 5 | ホテル検索・予約管理 + プラン提案 | [#5](https://github.com/nanashiNiA/travel-planner/issues/5) | 完了 | AI 3ティアプラン提案、ホテル推薦、アイテム入替、ユーザー設定 |
| 6 | レストラン検索 | [#6](https://github.com/nanashiNiA/travel-planner/issues/6) | 計画中 | 食事制限・アレルギー対応検索 |
| 7 | 為替レート・支払いガイド | [#7](https://github.com/nanashiNiA/travel-planner/issues/7) | 計画中 | リアルタイム為替、通貨換算 |
