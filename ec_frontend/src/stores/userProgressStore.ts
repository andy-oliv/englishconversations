import { create } from "zustand";
import type { UserProgress } from "../schemas/userProgress.schema";

interface UserProgressStoreState {
  data: UserProgress | null;
  setData: (data: UserProgress) => void;
  resetData: () => void;
}

export const useUserProgressStore = create<UserProgressStoreState>((set) => ({
  data: null,
  setData: (progress: UserProgress) => set({ data: progress }),
  resetData: () => set({ data: null }),
}));
