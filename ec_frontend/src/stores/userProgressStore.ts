import { create } from "zustand";
import type { UserProgress } from "../schemas/userProgress.schema";

interface UserProgressStoreState {
  data: UserProgress | null;
  setData: (data: UserProgress) => void;
  resetData: () => void;
}

export const useUserProgressStore = create<UserProgressStoreState>((set) => ({
  data: JSON.parse(sessionStorage.getItem("userProgress") ?? "null"),
  setData: (progressData: UserProgress) => {
    set({ data: progressData });
    sessionStorage.setItem("userProgress", JSON.stringify(progressData));
  },
  resetData: () => {
    set({ data: null });
    sessionStorage.removeItem("userProgress");
  },
}));
