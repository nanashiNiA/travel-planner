export interface Phrase {
  id: string;
  text: string;
}

export interface PhraseCategory {
  id: string;
  label: string;
  iconName: "hand-metal" | "utensils" | "train-front" | "hotel" | "siren" | "shopping-bag";
  phrases: Phrase[];
}

export const PHRASE_CATEGORIES: PhraseCategory[] = [
  {
    id: "greetings",
    label: "挨拶",
    iconName: "hand-metal",
    phrases: [
      { id: "g1", text: "Hello" },
      { id: "g2", text: "Thank you very much" },
      { id: "g3", text: "Excuse me" },
      { id: "g4", text: "I'm sorry" },
      { id: "g5", text: "Do you speak English?" },
      { id: "g6", text: "I don't understand" },
      { id: "g7", text: "Yes / No" },
      { id: "g8", text: "Goodbye" },
    ],
  },
  {
    id: "restaurant",
    label: "レストラン",
    iconName: "utensils",
    phrases: [
      { id: "r1", text: "A table for two, please" },
      { id: "r2", text: "Can I see the menu?" },
      { id: "r3", text: "I'm allergic to..." },
      { id: "r4", text: "I'm vegetarian / vegan" },
      { id: "r5", text: "No pork / No alcohol (Halal)" },
      { id: "r6", text: "The check, please" },
      { id: "r7", text: "Is this spicy?" },
      { id: "r8", text: "Water, please" },
    ],
  },
  {
    id: "transport",
    label: "交通",
    iconName: "train-front",
    phrases: [
      { id: "t1", text: "Where is the nearest train station?" },
      { id: "t2", text: "How do I get to...?" },
      { id: "t3", text: "One ticket to..., please" },
      { id: "t4", text: "Which platform?" },
      { id: "t5", text: "Does this bus go to...?" },
      { id: "t6", text: "How much is the fare?" },
      { id: "t7", text: "Please take me to this address" },
      { id: "t8", text: "Where can I buy an IC card?" },
    ],
  },
  {
    id: "hotel",
    label: "ホテル",
    iconName: "hotel",
    phrases: [
      { id: "h1", text: "I have a reservation under..." },
      { id: "h2", text: "What time is check-in / check-out?" },
      { id: "h3", text: "Is Wi-Fi available?" },
      { id: "h4", text: "Can I leave my luggage?" },
      { id: "h5", text: "The air conditioning isn't working" },
      { id: "h6", text: "Could I have extra towels?" },
    ],
  },
  {
    id: "emergency",
    label: "緊急",
    iconName: "siren",
    phrases: [
      { id: "e1", text: "Please help me!" },
      { id: "e2", text: "I need a doctor" },
      { id: "e3", text: "Call an ambulance, please" },
      { id: "e4", text: "I lost my passport" },
      { id: "e5", text: "Where is the nearest hospital?" },
      { id: "e6", text: "I feel sick" },
      { id: "e7", text: "Where is the police station?" },
    ],
  },
  {
    id: "shopping",
    label: "買い物",
    iconName: "shopping-bag",
    phrases: [
      { id: "s1", text: "How much is this?" },
      { id: "s2", text: "Do you accept credit cards?" },
      { id: "s3", text: "Can I try this on?" },
      { id: "s4", text: "Do you have a smaller / larger size?" },
      { id: "s5", text: "Is there a tax-free option?" },
      { id: "s6", text: "Can I have a bag?" },
    ],
  },
];
