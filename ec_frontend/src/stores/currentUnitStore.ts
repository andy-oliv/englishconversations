import { create } from "zustand";

interface CurrentUnitStoreState {
  unit: {
    id: number;
    title: string;
    description: string;
    unitNumber: number;
  } | null;
  setUnit: (data: {
    id: number;
    title: string;
    description: string;
    unitNumber: number;
  }) => void;
  resetUnit: () => void;
}

export const useCurrentUnitStore = create<CurrentUnitStoreState>((set) => ({
  unit: null,
  setUnit: (data) => set({ unit: data }),
  resetUnit: () => set({ unit: null }),
}));
