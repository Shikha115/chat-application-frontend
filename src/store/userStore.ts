import { create } from "zustand";
import { IUser } from "../services/user.service";
import { IMessage } from "../services/message.service";



interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
  notifications: IMessage[];
  setNotifications: (notifications: IMessage[]) => void;
  clearNotifications: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  // ======
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  clearNotifications: () => set({ notifications: [] }),
  // =======
}));
