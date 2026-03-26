// Maps common destination keywords to ISO 3166-1 alpha-2 country codes.
// Keys are lowercase. Both English and Japanese names included.

const DESTINATION_COUNTRY_MAP: Record<string, string> = {
  // Japan
  japan: "JP", 日本: "JP", tokyo: "JP", 東京: "JP", osaka: "JP", 大阪: "JP",
  kyoto: "JP", 京都: "JP", fukuoka: "JP", 福岡: "JP", sapporo: "JP", 札幌: "JP",
  okinawa: "JP", 沖縄: "JP", hiroshima: "JP", 広島: "JP", nagoya: "JP", 名古屋: "JP",
  yokohama: "JP", 横浜: "JP", kobe: "JP", 神戸: "JP", nara: "JP", 奈良: "JP",

  // USA
  "united states": "US", usa: "US", america: "US", アメリカ: "US",
  "new york": "US", ニューヨーク: "US", "los angeles": "US", ロサンゼルス: "US",
  "san francisco": "US", サンフランシスコ: "US", hawaii: "US", ハワイ: "US",
  guam: "US", グアム: "US", chicago: "US", シカゴ: "US", "las vegas": "US",

  // UK
  "united kingdom": "GB", uk: "GB", england: "GB", britain: "GB",
  イギリス: "GB", london: "GB", ロンドン: "GB",

  // France
  france: "FR", フランス: "FR", paris: "FR", パリ: "FR", nice: "FR", ニース: "FR",

  // Germany
  germany: "DE", ドイツ: "DE", berlin: "DE", ベルリン: "DE", munich: "DE", ミュンヘン: "DE",

  // Italy
  italy: "IT", イタリア: "IT", rome: "IT", ローマ: "IT", milan: "IT", ミラノ: "IT",
  venice: "IT", ベネチア: "IT", florence: "IT", フィレンツェ: "IT",

  // Spain
  spain: "ES", スペイン: "ES", barcelona: "ES", バルセロナ: "ES", madrid: "ES", マドリード: "ES",

  // South Korea
  "south korea": "KR", korea: "KR", 韓国: "KR", seoul: "KR", ソウル: "KR",
  busan: "KR", 釜山: "KR", jeju: "KR", 済州: "KR",

  // China
  china: "CN", 中国: "CN", beijing: "CN", 北京: "CN", shanghai: "CN", 上海: "CN",
  guangzhou: "CN", 広州: "CN", chengdu: "CN",

  // Taiwan
  taiwan: "TW", 台湾: "TW", taipei: "TW", 台北: "TW", kaohsiung: "TW", 高雄: "TW",

  // Thailand
  thailand: "TH", タイ: "TH", bangkok: "TH", バンコク: "TH", chiangmai: "TH",
  チェンマイ: "TH", phuket: "TH", プーケット: "TH",

  // Vietnam
  vietnam: "VN", ベトナム: "VN", hanoi: "VN", ハノイ: "VN",
  "ho chi minh": "VN", ホーチミン: "VN",

  // Singapore
  singapore: "SG", シンガポール: "SG",

  // Australia
  australia: "AU", オーストラリア: "AU", sydney: "AU", シドニー: "AU",
  melbourne: "AU", メルボルン: "AU",

  // Indonesia
  indonesia: "ID", インドネシア: "ID", bali: "ID", バリ: "ID", jakarta: "ID",

  // Canada
  canada: "CA", カナダ: "CA", vancouver: "CA", バンクーバー: "CA",
  toronto: "CA", トロント: "CA",

  // New Zealand
  "new zealand": "NZ", ニュージーランド: "NZ", auckland: "NZ", オークランド: "NZ",
};

export function resolveCountryCode(destination: string): string | null {
  const lower = destination.toLowerCase().trim();

  // Exact match first
  if (DESTINATION_COUNTRY_MAP[lower]) {
    return DESTINATION_COUNTRY_MAP[lower];
  }

  // Substring match
  for (const [keyword, code] of Object.entries(DESTINATION_COUNTRY_MAP)) {
    if (lower.includes(keyword)) {
      return code;
    }
  }

  return null;
}
