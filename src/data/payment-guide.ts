export interface PaymentGuide {
  countryCode: string;
  currency: string;
  currencySymbol: string;
  currencyCode: string;
  cashUsage: string;
  cardAcceptance: string;
  mobilePay: string;
  tipping: string;
  notes?: string;
}

export const PAYMENT_GUIDES: PaymentGuide[] = [
  {
    countryCode: "JP",
    currency: "日本円",
    currencySymbol: "¥",
    currencyCode: "JPY",
    cashUsage: "現金はまだ広く使われている。小さな店や飲食店では現金のみの場合も多い",
    cardAcceptance: "大手チェーン・百貨店・コンビニではクレジットカード対応。VISAとMastercardが最も広く受け入れられている",
    mobilePay: "PayPay, Suica/PASMOなどの交通系ICカードが便利。Apple Pay対応も増加中",
    tipping: "チップ文化なし。サービス料が含まれていることが多い",
  },
  {
    countryCode: "US",
    currency: "米ドル",
    currencySymbol: "$",
    currencyCode: "USD",
    cashUsage: "ほぼ全てでカード決済可能だが、少額の現金があると便利",
    cardAcceptance: "クレジット/デビットカードがほぼ全てで使える",
    mobilePay: "Apple Pay, Google Payが広く普及",
    tipping: "レストラン: 15-20%、タクシー: 15-20%、ホテルベルボーイ: $1-2/荷物",
    notes: "チップは重要な文化。サービス業従事者の主要な収入源",
  },
  {
    countryCode: "GB",
    currency: "英ポンド",
    currencySymbol: "£",
    currencyCode: "GBP",
    cashUsage: "キャッシュレス化が進んでおり、カードのみの店も増加",
    cardAcceptance: "コンタクトレス決済が非常に普及",
    mobilePay: "Apple Pay, Google Payが広く使える",
    tipping: "レストラン: 10-15%（サービス料込みの場合は不要）",
  },
  {
    countryCode: "FR",
    currency: "ユーロ",
    currencySymbol: "€",
    currencyCode: "EUR",
    cashUsage: "小さなカフェや市場では現金が好まれる",
    cardAcceptance: "広く使える。コンタクトレス決済も普及",
    mobilePay: "Apple Payが使える店が増加中",
    tipping: "サービス料込み（service compris）が一般的。良いサービスに1-2€の追加は喜ばれる",
  },
  {
    countryCode: "KR",
    currency: "韓国ウォン",
    currencySymbol: "₩",
    currencyCode: "KRW",
    cashUsage: "キャッシュレスが非常に進んでいる。現金なしでほぼ生活可能",
    cardAcceptance: "ほぼ全ての場所でカード決済可能",
    mobilePay: "KakaoPay, Samsung Pay, T-moneyカードが便利",
    tipping: "チップ文化なし",
  },
  {
    countryCode: "CN",
    currency: "人民元",
    currencySymbol: "¥",
    currencyCode: "CNY",
    cashUsage: "モバイル決済が主流。現金は使いにくくなっている",
    cardAcceptance: "国際カードは大手ホテル・百貨店のみ。VISA/Mastercardの普及率は低い",
    mobilePay: "Alipay, WeChat Payが必須。外国人向けの短期利用設定も可能",
    tipping: "チップ文化なし",
    notes: "外国人観光客向けにAlipayのTour Passがおすすめ",
  },
  {
    countryCode: "TW",
    currency: "台湾ドル",
    currencySymbol: "NT$",
    currencyCode: "TWD",
    cashUsage: "夜市や小さな店では現金が必要",
    cardAcceptance: "大手店舗やコンビニではカード対応",
    mobilePay: "LINE Pay, Apple Payが使える。悠遊カード（EasyCard）が交通+買い物に便利",
    tipping: "チップ文化なし。高級レストランでは10%のサービス料が含まれることがある",
  },
  {
    countryCode: "TH",
    currency: "タイバーツ",
    currencySymbol: "฿",
    currencyCode: "THB",
    cashUsage: "屋台や小さな店では現金が必要。ATMで現地通貨を引き出すのが便利",
    cardAcceptance: "大型ショッピングモールやホテルではカード対応",
    mobilePay: "PromptPay, Rabbit LINE Payが普及中",
    tipping: "義務ではないが、良いサービスに20-50バーツ程度は喜ばれる",
  },
  {
    countryCode: "SG",
    currency: "シンガポールドル",
    currencySymbol: "S$",
    currencyCode: "SGD",
    cashUsage: "キャッシュレスが進んでいるが、ホーカーセンターでは現金が便利",
    cardAcceptance: "広く対応。NETS, コンタクトレス決済が普及",
    mobilePay: "GrabPay, PayNowが便利",
    tipping: "チップ文化なし。10%のサービス料と7%のGSTが加算される",
  },
  {
    countryCode: "AU",
    currency: "豪ドル",
    currencySymbol: "A$",
    currencyCode: "AUD",
    cashUsage: "キャッシュレスが非常に進んでいる",
    cardAcceptance: "コンタクトレス決済がほぼ全てで使える",
    mobilePay: "Apple Pay, Google Payが広く普及",
    tipping: "義務ではないが、レストランで10%程度は一般的",
  },
];

export function getPaymentGuideByCountry(
  countryCode: string
): PaymentGuide | undefined {
  return PAYMENT_GUIDES.find((g) => g.countryCode === countryCode);
}
