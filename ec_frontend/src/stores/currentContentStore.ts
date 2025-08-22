import { create } from "zustand";

interface CurrentContentStoreState {
  content: {
    id: string;
    type: string;
    title: string;
    description: string;
  } | null;
  setContent: (data: {
    id: string;
    type: string;
    title: string;
    description: string;
  }) => void;
  resetContent: () => void;
}

export const useCurrentContentStore = create<CurrentContentStoreState>(
  (set) => ({
    content: null,
    setContent: (data) => set({ content: data }),
    resetContent: () => set({ content: null }),
  })
);
