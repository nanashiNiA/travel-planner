# 緊急連絡先・病院検索 設計メモ

Issue: [#3](https://github.com/nanashiNiA/travel-planner/issues/3)

## 概要
旅行の目的地に基づいて国別緊急連絡先を自動表示し、Google Mapsで周辺の病院・薬局を検索。保険情報も管理可能。

## アクセス
- 旅行詳細ページ → 「緊急情報」ボタン → `/trips/[tripId]/emergency`
- 3タブ構成: 緊急連絡先 / 周辺の病院 / 保険情報

## アーキテクチャ

### 緊急連絡先（オフライン対応）
- 静的データ: `src/data/emergency-contacts.ts`（17カ国対応）
- 目的地→国コード変換: `src/data/destination-countries.ts`（部分一致、日英対応）
- サーバーレンダリング → HTMLにすべての番号が含まれる（ネット不要）
- `tel:` リンクでワンタップ発信

### 病院検索
- クライアントサイドで `navigator.geolocation` → 現在地取得
- サーバーAPI `POST /api/places/nearby` → Google Places API (New) プロキシ
- `@vis.gl/react-google-maps` で地図表示
- 病院 / 薬局 / クリニック の切り替え

### 保険情報
- Trip モデルに `insuranceInfo` (JSON) フィールド追加
- `GET/PUT /api/trips/[tripId]/insurance` で CRUD
- React Hook Form + Zod バリデーション

## 対応国（17カ国）
日本, アメリカ, イギリス, フランス, ドイツ, イタリア, スペイン, 韓国, 中国, 台湾, タイ, ベトナム, シンガポール, オーストラリア, インドネシア, カナダ, ニュージーランド

## ファイル構成
```
src/
├── data/
│   ├── emergency-contacts.ts     # 国別緊急連絡先データ
│   └── destination-countries.ts   # 目的地→国コード変換
├── app/
│   ├── (dashboard)/trips/[tripId]/emergency/page.tsx  # 緊急ページ
│   └── api/
│       ├── places/nearby/route.ts           # Places APIプロキシ
│       └── trips/[tripId]/insurance/route.ts # 保険CRUD
├── components/emergency/
│   ├── emergency-contacts-tab.tsx  # 連絡先表示
│   ├── nearby-hospitals-tab.tsx    # 病院検索地図
│   ├── insurance-info-tab.tsx      # 保険情報フォーム
│   └── country-selector.tsx        # 国選択フォールバック
├── components/layout/
│   └── emergency-button.tsx        # 旅行詳細の緊急ボタン
└── validators/
    ├── places.ts                   # Places APIスキーマ
    └── insurance.ts                # 保険情報スキーマ
```
