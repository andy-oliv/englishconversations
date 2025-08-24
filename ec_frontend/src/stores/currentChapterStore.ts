import { create } from "zustand";
import type { CurrentChapter } from "../schemas/currentChapter.schema";
import type { Unit } from "../schemas/unit.schema";
import type { Content } from "../schemas/content.schema";

interface CurrentChapterStoreState {
  data: CurrentChapter | null;
  currentUnitId: number | null;
  currentContentId: number | null;
  setCurrentChapter: (data: CurrentChapter) => void;
  setCurrentUnitId: (id: number) => void;
  setCurrentContentId: (id: number) => void;
  resetCurrentChapter: () => void;
  getCurrentUnit: () => Unit | null;
  getCurrentContent: () => Content | null;
  updateUnit: (unitId: number, data: Partial<Unit>) => void;
  updateContent: (
    unitId: number,
    contentId: number,
    data: Partial<Content>
  ) => void;
}

export const useCurrentChapterStore = create<CurrentChapterStoreState>(
  (set, get) => ({
    data: JSON.parse(sessionStorage.getItem("currentChapter") ?? "null"),
    currentUnitId: JSON.parse(
      sessionStorage.getItem("currentUnitId") ?? "null"
    ),
    currentContentId: JSON.parse(
      sessionStorage.getItem("currentContentId") ?? "null"
    ),
    setCurrentChapter: (data) => {
      set({ data });
      sessionStorage.setItem("currentChapter", JSON.stringify(data));
    },
    setCurrentUnitId: (id) => {
      set({ currentUnitId: id });
      sessionStorage.setItem("currentUnitId", JSON.stringify(id));
    },
    setCurrentContentId: (id) => {
      set({ currentContentId: id });
      sessionStorage.setItem("currentContentId", JSON.stringify(id));
    },
    resetCurrentChapter: () => {
      set({ data: null });
      sessionStorage.removeItem("currentChapter");
      sessionStorage.removeItem("currentUnitId");
      sessionStorage.removeItem("currentContentId");
    },
    getCurrentUnit: () => {
      const { data, currentUnitId } = get();
      return (
        data?.units?.find((unit: Unit) => unit.id === currentUnitId) || null
      );
    },
    getCurrentContent: () => {
      const { getCurrentUnit, currentContentId } = get();
      const currentUnit: Unit | null = getCurrentUnit();
      return (
        currentUnit?.contents?.find(
          (content: Content) => content.id === currentContentId
        ) || null
      );
    },
    updateUnit: (unitId, updatedData) => {
      const { data } = get();
      if (!data) return;
      const units: Unit[] | undefined = data?.units;
      if (units) {
        const unit: Unit | null =
          units.find((unit) => unit.id === unitId) || null;
        if (unit) {
          const updatedUnit: Unit = {
            ...unit,
            ...updatedData,
          };
          const updatedUnits: Unit[] = units.map((unit) =>
            unit.id === updatedUnit.id ? updatedUnit : unit
          );
          const updatedChapter: CurrentChapter = {
            ...data,
            units: updatedUnits,
          };
          set({ data: updatedChapter });
          sessionStorage.setItem(
            "currentChapter",
            JSON.stringify(updatedChapter)
          );
        }
      }
    },
    updateContent: (unitId, contentId, updatedData) => {
      const { data } = get();
      if (!data) return;
      const units: Unit[] | undefined = data?.units;
      if (units) {
        const unit: Unit | null =
          units.find((unit) => unit.id === unitId) || null;
        if (unit) {
          const content: Content | undefined = unit.contents.find(
            (content) => content.id === contentId
          );
          if (content) {
            const updatedContent: Content = {
              ...content,
              ...updatedData,
            };

            const updatedContents: Content[] = unit.contents.map((content) =>
              content.id === contentId ? updatedContent : content
            );
            const updatedUnits: Unit[] = units.map((unit) =>
              unit.id === unitId ? { ...unit, contents: updatedContents } : unit
            );
            const updatedChapter: CurrentChapter = {
              ...data,
              units: updatedUnits,
            };

            set({ data: updatedChapter });
            sessionStorage.setItem(
              "currentChapter",
              JSON.stringify(updatedChapter)
            );
          }
        }
      }
    },
  })
);
