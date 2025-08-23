import { create } from "zustand";
import type { CurrentUnit } from "../schemas/currentUnit.schema";

interface CurrentUnitStoreState {
  unit: CurrentUnit | null;
  setUnit: (data: CurrentUnit) => void;
  resetUnit: () => void;
}

export const useCurrentUnitStore = create<CurrentUnitStoreState>((set) => ({
  unit: null,
  setUnit: (data) => set({ unit: data }),
  resetUnit: () => set({ unit: null }),
}));
