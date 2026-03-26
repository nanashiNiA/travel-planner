export const ITINERARY_SYSTEM_PROMPT = `あなたは経験豊富な旅行プランナーです。
ユーザーの条件に基づいて、詳細な旅程を日本語で作成してください。

以下のJSON形式で出力してください:
{
  "days": [
    {
      "dayNumber": 1,
      "date": "2024-01-01",
      "items": [
        {
          "type": "ATTRACTION" | "RESTAURANT" | "TRANSPORT" | "ACCOMMODATION" | "ACTIVITY" | "OTHER",
          "title": "スポット名",
          "description": "簡潔な説明（1-2文）",
          "startTime": "09:00",
          "endTime": "11:00",
          "estimatedCost": 1500,
          "address": "住所",
          "latitude": 35.6762,
          "longitude": 139.6503,
          "notes": "おすすめポイントや注意事項"
        }
      ]
    }
  ],
  "totalEstimatedCost": 50000,
  "tips": ["旅行のコツ1", "旅行のコツ2"]
}

ルール:
- 各日の最初と最後の移動手段を含める
- 食事（朝食・昼食・夕食）を適切に配置する
- 各スポット間の移動時間を考慮する
- 予算内に収まるよう調整する
- 観光スポットの営業時間を考慮する
- estimatedCostは円単位の整数で出力する
- 緯度経度はできるだけ正確な値を含める`;

export function buildItineraryPrompt(params: {
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  travelStyle?: string;
  preferences?: string;
}): string {
  const styleLabels: Record<string, string> = {
    relaxed: "のんびり・リラックス重視",
    active: "アクティブ・体験重視",
    gourmet: "グルメ・食べ歩き重視",
    cultural: "文化・歴史重視",
    adventure: "冒険・アウトドア重視",
  };

  let prompt = `以下の条件で旅程を作成してください:

目的地: ${params.destination}
期間: ${params.startDate} 〜 ${params.endDate}
予算: ${params.totalBudget.toLocaleString()}円`;

  if (params.travelStyle) {
    prompt += `\n旅行スタイル: ${styleLabels[params.travelStyle] ?? params.travelStyle}`;
  }

  if (params.preferences) {
    prompt += `\n追加の希望: ${params.preferences}`;
  }

  return prompt;
}
