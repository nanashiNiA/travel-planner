export interface DietaryOption {
  id: string;
  label: string;
  labelEn: string;
  searchKeyword: string;
}

export const DIETARY_OPTIONS: DietaryOption[] = [
  { id: "halal", label: "ハラル", labelEn: "Halal", searchKeyword: "halal restaurant" },
  { id: "vegetarian", label: "ベジタリアン", labelEn: "Vegetarian", searchKeyword: "vegetarian restaurant" },
  { id: "vegan", label: "ビーガン", labelEn: "Vegan", searchKeyword: "vegan restaurant" },
  { id: "kosher", label: "コーシャ", labelEn: "Kosher", searchKeyword: "kosher restaurant" },
  { id: "gluten-free", label: "グルテンフリー", labelEn: "Gluten-free", searchKeyword: "gluten free restaurant" },
  { id: "allergy", label: "アレルギー対応", labelEn: "Allergy-friendly", searchKeyword: "allergy friendly restaurant" },
];
