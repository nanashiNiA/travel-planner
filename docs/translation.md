# リアルタイム翻訳機能 設計メモ

Issue: [#2](https://github.com/nanashiNiA/travel-planner/issues/2)

## 概要
既存のAIチャットに翻訳モードを統合。テキスト翻訳・音声入出力・フレーズ集を実装。

## 設計方針

- **バックエンド**: OpenAI gpt-4o-mini（既存インフラ、追加API不要）
- **UI**: チャットSheet内の翻訳モードとして統合
- **音声**: Web Speech API（ブラウザネイティブ）
- **カメラOCR**: 今回は対象外（後続イテレーションで追加予定）

## アーキテクチャ

### 翻訳フロー
```
ユーザー入力 → フロントでプロンプト構築 → 既存 /api/ai/chat → 翻訳結果表示
```

### プロンプト構築（フロント側）
```
[TRANSLATE] Translate the following to {targetLanguage}.
Provide ONLY the translation on the first line.
If the target language uses non-Latin script, add romanization on the second line.

{ユーザー入力テキスト}
```

### API変更なし
既存の `/api/ai/chat` エンドポイントをそのまま利用。
システムプロンプトに `[TRANSLATE]` プレフィックスの処理指示を追加済み。

## ファイル構成

```
src/
├── data/
│   ├── languages.ts           # 言語マスターデータ（11言語）
│   └── phrase-book.ts         # フレーズ集（6カテゴリ, 各6-8フレーズ）
├── hooks/
│   ├── use-speech-recognition.ts  # 音声入力フック
│   └── use-speech-synthesis.ts    # 読み上げフック
├── types/
│   └── speech.d.ts            # webkitSpeechRecognition型宣言
├── components/chat/
│   ├── translation-toolbar.tsx    # 言語選択ツールバー
│   ├── phrase-book-panel.tsx      # フレーズ集パネル
│   ├── translation-message.tsx    # 翻訳結果表示（読み上げ+コピー）
│   └── chat-panel.tsx             # 統合（修正済み）
├── prompts/
│   └── chat-support.ts           # プロンプト（翻訳指示追加済み）
└── stores/
    └── chat-store.ts             # 翻訳モード状態追加済み
```

## 対応言語
日本語, English, 한국어, 中文, Español, Français, Deutsch, ไทย, Tiếng Việt, Português + 自動検出

## 音声機能

### Speech Recognition（音声入力）
- **対応ブラウザ**: Chrome, Edge（`webkitSpeechRecognition`）
- **非対応ブラウザ**: マイクボタンを非表示（`isSupported`フラグ）
- ソース言語の`speechCode`で認識言語を指定

### Speech Synthesis（読み上げ）
- **対応ブラウザ**: ほぼ全てのモダンブラウザ
- ターゲット言語の`speechCode`で音声を選択
- 翻訳結果メッセージに読み上げボタンを配置

## フレーズ集カテゴリ
1. 挨拶（8フレーズ）
2. レストラン（8フレーズ）
3. 交通（8フレーズ）
4. ホテル（6フレーズ）
5. 緊急（7フレーズ）
6. 買い物（6フレーズ）

## 今後の拡張予定
- [ ] カメラOCR（画像 → テキスト抽出 → 翻訳）
- [ ] 翻訳履歴・お気に入り保存
- [ ] オフラインフレーズキャッシュ
