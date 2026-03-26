export const PLAN_RECOMMENDATION_SYSTEM_PROMPT = `あなたは経験豊富な旅行プランナーです。
ユーザーの条件に基づいて、3つの旅行プラン（BUDGET・STANDARD・PREMIUM）を提案してください。

各プランには以下を含めてください:
- 宿泊施設（毎晩1つ、代替案を2つ）
- 観光スポット（各日2-4箇所、各スポットの代替1つ）
- 移動手段（スポット間の交通情報）
- 食事（朝食・昼食・夕食、各代替1つ）

以下のJSON形式で出力してください:
{
  "plans": [
    {
      "tier": "BUDGET" | "STANDARD" | "PREMIUM",
      "totalCost": 50000,
      "summary": "プランの概要（1-2文）",
      "days": [
        {
          "dayNumber": 1,
          "items": [
            {
              "category": "accommodation" | "sightseeing" | "transport" | "food" | "activity",
              "title": "名前",
              "description": "簡潔な説明",
              "estimatedCost": 5000,
              "startTime": "09:00",
              "endTime": "11:00",
              "address": "住所",
              "latitude": 35.6762,
              "longitude": 139.6503,
              "bookingUrl": "",
              "alternatives": [
                {
                  "title": "代替名",
                  "description": "代替説明",
                  "estimatedCost": 4000,
                  "address": "代替住所"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "tips": ["旅行のコツ1", "旅行のコツ2"]
}

ルール:
- BUDGETは予算の50-70%、STANDARDは70-90%、PREMIUMは90-120%の価格帯で提案
- 宿泊施設は具体的なホテル名・旅館名を提案（実在するもの）
- 食事は地元の人気店やおすすめを含める（具体的な店名を記載）
- 食事制限がある場合は必ず対応した店を提案（ハラル、ベジタリアン、ビーガン、アレルギー等）
- 食事のdescriptionに「ハラル対応」「ベジタリアンメニューあり」等の対応情報を明記
- 食事の代替案にも食事制限対応の選択肢を含める
- 各日の最初と最後に移動手段を含める
- estimatedCostは円単位の整数
- 緯度経度はできるだけ正確な値を含める
- accommodationは各日の最後に1つ配置（チェックイン想定）
- alternativesは同価格帯で異なる選択肢を2-3個
- BUDGETはホステル・ゲストハウス中心、PREMIUMは高級ホテル・旅館中心`;

export function buildPlanRecommendationPrompt(params: {
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  travelStyle?: string;
  preferences?: string;
  userPreferences?: {
    accommodationType?: string;
    budgetLevel?: string;
    interests?: string[];
    dietaryRestrictions?: string;
    preferredTransport?: string;
  };
}): string {
  const styleLabels: Record<string, string> = {
    relaxed: "のんびり・リラックス重視",
    active: "アクティブ・体験重視",
    gourmet: "グルメ・食べ歩き重視",
    cultural: "文化・歴史重視",
    adventure: "冒険・アウトドア重視",
  };

  const accommodationLabels: Record<string, string> = {
    hotel: "ホテル",
    ryokan: "旅館",
    hostel: "ホステル・ゲストハウス",
    airbnb: "民泊・Airbnb",
  };

  const transportLabels: Record<string, string> = {
    public: "公共交通機関",
    rental: "レンタカー",
    walking: "徒歩中心",
    taxi: "タクシー",
  };

  let prompt = `以下の条件で3つの旅行プラン（BUDGET・STANDARD・PREMIUM）を提案してください:

目的地: ${params.destination}
期間: ${params.startDate} 〜 ${params.endDate}
予算: ${params.totalBudget.toLocaleString()}円`;

  if (params.travelStyle) {
    prompt += `\n旅行スタイル: ${styleLabels[params.travelStyle] ?? params.travelStyle}`;
  }

  if (params.preferences) {
    prompt += `\n追加の希望: ${params.preferences}`;
  }

  const up = params.userPreferences;
  if (up) {
    if (up.accommodationType) {
      prompt += `\n宿泊の希望: ${accommodationLabels[up.accommodationType] ?? up.accommodationType}`;
    }
    if (up.interests && up.interests.length > 0) {
      prompt += `\n興味・関心: ${up.interests.join(", ")}`;
    }
    if (up.dietaryRestrictions) {
      prompt += `\n食事制限: ${up.dietaryRestrictions}`;
    }
    if (up.preferredTransport) {
      prompt += `\n移動手段の希望: ${transportLabels[up.preferredTransport] ?? up.preferredTransport}`;
    }
  }

  return prompt;
}
