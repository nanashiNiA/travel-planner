import { create } from "zustand";

interface ChatStore {
  activeTripId: string | null;
  conversationId: string | null;
  isOpen: boolean;
  translationMode: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  setActiveTripId: (id: string | null) => void;
  setConversationId: (id: string | null) => void;
  setOpen: (open: boolean) => void;
  setTranslationMode: (on: boolean) => void;
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  swapLanguages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  activeTripId: null,
  conversationId: null,
  isOpen: false,
  translationMode: false,
  sourceLanguage: "auto",
  targetLanguage: "ja",
  setActiveTripId: (id) => set({ activeTripId: id }),
  setConversationId: (id) => set({ conversationId: id }),
  setOpen: (open) => set({ isOpen: open }),
  setTranslationMode: (on) => set({ translationMode: on }),
  setSourceLanguage: (lang) => set({ sourceLanguage: lang }),
  setTargetLanguage: (lang) => set({ targetLanguage: lang }),
  swapLanguages: () => {
    const { sourceLanguage, targetLanguage } = get();
    if (sourceLanguage !== "auto") {
      set({ sourceLanguage: targetLanguage, targetLanguage: sourceLanguage });
    }
  },
}));
