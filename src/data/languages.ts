export interface Language {
  code: string;
  label: string;
  labelEn: string;
  speechCode?: string;
}

export const LANGUAGES: Language[] = [
  { code: "auto", label: "自動検出", labelEn: "Auto-detect" },
  { code: "ja", label: "日本語", labelEn: "Japanese", speechCode: "ja-JP" },
  { code: "en", label: "English", labelEn: "English", speechCode: "en-US" },
  { code: "ko", label: "한국어", labelEn: "Korean", speechCode: "ko-KR" },
  { code: "zh", label: "中文", labelEn: "Chinese", speechCode: "zh-CN" },
  { code: "es", label: "Español", labelEn: "Spanish", speechCode: "es-ES" },
  { code: "fr", label: "Français", labelEn: "French", speechCode: "fr-FR" },
  { code: "de", label: "Deutsch", labelEn: "German", speechCode: "de-DE" },
  { code: "th", label: "ไทย", labelEn: "Thai", speechCode: "th-TH" },
  { code: "vi", label: "Tiếng Việt", labelEn: "Vietnamese", speechCode: "vi-VN" },
  { code: "pt", label: "Português", labelEn: "Portuguese", speechCode: "pt-BR" },
];

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}
