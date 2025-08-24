import { create } from "zustand";
import type { User } from "../schemas/user.schema";

interface UserStoreState {
  data: User | null;
  setUser: (data: User) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  data: JSON.parse(sessionStorage.getItem("user") ?? "null"),
  setUser: (userData) => {
    set({ data: userData });
    sessionStorage.setItem("user", JSON.stringify(userData));
  },
  resetUser: () => {
    set({ data: null });
    sessionStorage.removeItem("user");
  },
}));
