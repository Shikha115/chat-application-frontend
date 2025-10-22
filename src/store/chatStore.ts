import { create } from "zustand";
import { IChat } from "../services/chat.service";

interface ChatState {
  selectedChat: IChat | null;
  setSelectedChat: (chat: IChat | null) => void;
  clearSelectedChat: () => void;
  chats: IChat[];
  setChats: (chats: IChat[]) => void;
  clearChats: () => void;
 
}

export const useChatStore = create<ChatState>((set) => ({
  // ======
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  clearSelectedChat: () => set({ selectedChat: null }),
  // =====
  chats: [],
  setChats: (chats) => set({ chats }),
  clearChats: () => set({ chats: [] }),

}));
