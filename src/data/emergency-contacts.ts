export interface EmergencyContact {
  countryCode: string;
  countryName: string;
  countryNameJa: string;
  dialCode: string;
  police: string;
  ambulance: string;
  fire: string;
  generalEmergency?: string;
  touristHotline?: string;
  japaneseEmbassy?: {
    phone: string;
    address: string;
  };
  notes?: string;
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    countryCode: "JP",
    countryName: "Japan",
    countryNameJa: "日本",
    dialCode: "+81",
    police: "110",
    ambulance: "119",
    fire: "119",
    touristHotline: "050-3816-2787",
    notes: "救急と消防は同じ番号(119)。英語対応の救急: #7119",
  },
  {
    countryCode: "US",
    countryName: "United States",
    countryNameJa: "アメリカ",
    dialCode: "+1",
    police: "911",
    ambulance: "911",
    fire: "911",
    generalEmergency: "911",
    japaneseEmbassy: {
      phone: "+1-202-238-6700",
      address: "2520 Massachusetts Avenue NW, Washington, DC 20008",
    },
    notes: "全ての緊急通報は911。医療費が非常に高額なため保険必須",
  },
  {
    countryCode: "GB",
    countryName: "United Kingdom",
    countryNameJa: "イギリス",
    dialCode: "+44",
    police: "999",
    ambulance: "999",
    fire: "999",
    generalEmergency: "112",
    japaneseEmbassy: {
      phone: "+44-20-7465-6500",
      address: "101-104 Piccadilly, London W1J 7JT",
    },
  },
  {
    countryCode: "FR",
    countryName: "France",
    countryNameJa: "フランス",
    dialCode: "+33",
    police: "17",
    ambulance: "15",
    fire: "18",
    generalEmergency: "112",
    japaneseEmbassy: {
      phone: "+33-1-48-88-62-00",
      address: "7 Avenue Hoche, 75008 Paris",
    },
  },
  {
    countryCode: "DE",
    countryName: "Germany",
    countryNameJa: "ドイツ",
    dialCode: "+49",
    police: "110",
    ambulance: "112",
    fire: "112",
    generalEmergency: "112",
    japaneseEmbassy: {
      phone: "+49-30-210940",
      address: "Hiroshimastraße 6, 10785 Berlin",
    },
  },
  {
    countryCode: "IT",
    countryName: "Italy",
    countryNameJa: "イタリア",
    dialCode: "+39",
    police: "113",
    ambulance: "118",
    fire: "115",
    generalEmergency: "112",
    japaneseEmbassy: {
      phone: "+39-06-487991",
      address: "Via Quintino Sella, 60, 00187 Roma",
    },
  },
  {
    countryCode: "ES",
    countryName: "Spain",
    countryNameJa: "スペイン",
    dialCode: "+34",
    police: "091",
    ambulance: "061",
    fire: "080",
    generalEmergency: "112",
    japaneseEmbassy: {
      phone: "+34-91-590-7600",
      address: "Calle Serrano 109, 28006 Madrid",
    },
  },
  {
    countryCode: "KR",
    countryName: "South Korea",
    countryNameJa: "韓国",
    dialCode: "+82",
    police: "112",
    ambulance: "119",
    fire: "119",
    touristHotline: "1330",
    japaneseEmbassy: {
      phone: "+82-2-2170-5200",
      address: "ソウル特別市鍾路区栗谷路6",
    },
    notes: "観光通訳案内電話1330は日本語対応",
  },
  {
    countryCode: "CN",
    countryName: "China",
    countryNameJa: "中国",
    dialCode: "+86",
    police: "110",
    ambulance: "120",
    fire: "119",
    japaneseEmbassy: {
      phone: "+86-10-6532-2361",
      address: "北京市朝陽区亮馬橋東街1号",
    },
  },
  {
    countryCode: "TW",
    countryName: "Taiwan",
    countryNameJa: "台湾",
    dialCode: "+886",
    police: "110",
    ambulance: "119",
    fire: "119",
    touristHotline: "0800-011-765",
    notes: "日本台湾交流協会: +886-2-2713-8000",
  },
  {
    countryCode: "TH",
    countryName: "Thailand",
    countryNameJa: "タイ",
    dialCode: "+66",
    police: "191",
    ambulance: "1669",
    fire: "199",
    touristHotline: "1155",
    japaneseEmbassy: {
      phone: "+66-2-207-8500",
      address: "177 Witthayu Road, Lumphini, Pathum Wan, Bangkok 10330",
    },
    notes: "ツーリストポリス: 1155（英語対応）",
  },
  {
    countryCode: "VN",
    countryName: "Vietnam",
    countryNameJa: "ベトナム",
    dialCode: "+84",
    police: "113",
    ambulance: "115",
    fire: "114",
    japaneseEmbassy: {
      phone: "+84-24-3846-3000",
      address: "27 Liễu Giai, Ba Đình, Hà Nội",
    },
  },
  {
    countryCode: "SG",
    countryName: "Singapore",
    countryNameJa: "シンガポール",
    dialCode: "+65",
    police: "999",
    ambulance: "995",
    fire: "995",
    japaneseEmbassy: {
      phone: "+65-6235-8855",
      address: "16 Nassim Road, Singapore 258390",
    },
  },
  {
    countryCode: "AU",
    countryName: "Australia",
    countryNameJa: "オーストラリア",
    dialCode: "+61",
    police: "000",
    ambulance: "000",
    fire: "000",
    generalEmergency: "000",
    japaneseEmbassy: {
      phone: "+61-2-6273-3244",
      address: "112 Empire Circuit, Yarralumla, ACT 2600",
    },
    notes: "全ての緊急通報は000。携帯からは112も使用可",
  },
  {
    countryCode: "ID",
    countryName: "Indonesia",
    countryNameJa: "インドネシア",
    dialCode: "+62",
    police: "110",
    ambulance: "118",
    fire: "113",
    japaneseEmbassy: {
      phone: "+62-21-3192-4308",
      address: "Jl. M.H. Thamrin No. 24, Jakarta 10350",
    },
    notes: "バリ島の観光警察: +62-361-224111",
  },
  {
    countryCode: "CA",
    countryName: "Canada",
    countryNameJa: "カナダ",
    dialCode: "+1",
    police: "911",
    ambulance: "911",
    fire: "911",
    generalEmergency: "911",
    japaneseEmbassy: {
      phone: "+1-613-241-8541",
      address: "255 Sussex Drive, Ottawa, Ontario K1N 9E6",
    },
  },
  {
    countryCode: "NZ",
    countryName: "New Zealand",
    countryNameJa: "ニュージーランド",
    dialCode: "+64",
    police: "111",
    ambulance: "111",
    fire: "111",
    generalEmergency: "111",
    japaneseEmbassy: {
      phone: "+64-4-473-1540",
      address: "Level 18, Majestic Centre, 100 Willis Street, Wellington 6011",
    },
  },
];

export function getEmergencyContactByCountry(
  countryCode: string
): EmergencyContact | undefined {
  return EMERGENCY_CONTACTS.find((c) => c.countryCode === countryCode);
}
