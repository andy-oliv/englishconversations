import { create } from "zustand";
import type { RecordedClass } from "../schemas/recordedClass.schema";

interface RecordedClassStoreState {
  recordedClasses: RecordedClass[] | null;
  setRecordedClasses: (recordedClasses: RecordedClass[]) => void;
  resetRecordedClasses: () => void;
}

export const useRecordedClassStore = create<RecordedClassStoreState>((set) => ({
  recordedClasses: JSON.parse(
    sessionStorage.getItem("recordedClasses") ?? "null"
  ),
  setRecordedClasses: (data) => {
    set({ recordedClasses: [...data] });
    sessionStorage.setItem("recordedClasses", JSON.stringify(data));
  },
  resetRecordedClasses: () => set({ recordedClasses: null }),
}));
