import { create } from "zustand";
import type { UnitProgress } from "../schemas/unitProgress.schema";

interface UnitProgressesStoreState {
  data: UnitProgress[] | null;
  setData: (data: UnitProgress[]) => void;
  resetData: () => void;
}

export const useUnitProgressesStore = create<UnitProgressesStoreState>(
  (set) => ({
    data: null,
    setData: (receivedData) => set({ data: receivedData }),
    resetData: () => set({ data: null }),
  })
);
