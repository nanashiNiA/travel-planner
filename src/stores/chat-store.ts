import { create } from "zustand";

interface ChatStore {
  activeTripId: string | null;
  conversationId: string | null;
  isOpen: boolean;
  setActiveTripId: (id: string | null) => void;
  setConversationId: (id: string | null) => void;
  setOpen: (open: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeTripId: null,
  conversationId: null,
  isOpen: false,
  setActiveTripId: (id) => set({ activeTripId: id }),
  setConversationId: (id) => set({ conversationId: id }),
  setOpen: (open) => set({ isOpen: open }),
}));
