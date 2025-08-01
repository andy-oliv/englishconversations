import { create } from "zustand";
import type { User } from "../schemas/user.schema";

interface UserStoreState {
  data: User | null;
  setUser: (data: User) => void;
  resetUser: () => void;
}

export const UserStore = create<UserStoreState>((set) => ({
  data: null,
  setUser: (userData) => set({ data: userData }),
  resetUser: () => set({ data: null }),
}));
