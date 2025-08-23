import { create } from "zustand";
import type { CurrentContent } from "../schemas/currentContent.schema";

interface CurrentContentStoreState {
  content: CurrentContent | null;
  setContent: (data: CurrentContent) => void;
  setIsFavorite: (data: boolean) => void;
  setNotes: (data: string) => void;
  resetContent: () => void;
}

export const useCurrentContentStore = create<CurrentContentStoreState>(
  (set) => ({
    content: null,
    setContent: (data) => set({ content: data }),
    setIsFavorite: (data) =>
      set((state) => ({
        content: state.content ? { ...state.content, isFavorite: data } : null,
      })),
    setNotes: (data) =>
      set((state) => ({
        content: state.content ? { ...state.content, notes: data } : null,
      })),
    resetContent: () => set({ content: null }),
  })
);
