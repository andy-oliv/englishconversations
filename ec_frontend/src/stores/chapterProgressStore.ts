import { create } from "zustand";
import type { ChapterProgress } from "../schemas/chapterProgress.schema";

interface ChapterProgressStoreState {
  data: ChapterProgress[] | null;
  setData: (data: ChapterProgress[]) => void;
  resetData: () => void;
}

export const useChapterProgressStore = create<ChapterProgressStoreState>(
  (set) => ({
    data: null,
    setData: (receivedData) => set({ data: receivedData }),
    resetData: () => set({ data: null }),
  })
);
