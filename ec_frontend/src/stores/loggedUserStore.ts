import { create } from "zustand";
import type { LoggedUser } from "../schemas/loggedUser.schema";

interface LoggedUserStoreState {
  data: LoggedUser | null;
  setUser: (data: LoggedUser) => void;
  getUser: () => void;
  resetUser: () => void;
}

export const LoggedUserStore = create<LoggedUserStoreState>((set, get) => ({
  data: null,
  setUser: (userData) => {
    set({ data: userData });
  },
  getUser: () => get().data,
  resetUser: () => set({ data: null }),
}));
