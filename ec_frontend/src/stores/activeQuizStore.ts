import { create } from "zustand";
import type { Quiz } from "../schemas/quiz.schema";
import type { Exercise } from "../schemas/exercise.schema";

interface ActiveQuizStoreState {
  quiz: Quiz | null;
  exercises: Exercise[];
  currentExerciseIndex: number;
  lastQuestion: number;
  elapsedTime: number;
  setQuiz: (quiz: Quiz) => void;
  reset: () => void;
  setExercises: (exercises: Exercise[]) => void;
  increaseCurrentExerciseIndex: () => void;
  decreaseCurrentExerciseIndex: () => void;
  setElapsedTime: (time: number) => void;
}

export const useActiveQuizStore = create<ActiveQuizStoreState>((set) => ({
  quiz: null,
  exercises: [],
  currentExerciseIndex: 0,
  lastQuestion: 0,
  elapsedTime: 0,
  setQuiz: (quiz) => set({ quiz }),
  reset: () =>
    set({ quiz: null, exercises: [], currentExerciseIndex: 0, elapsedTime: 0 }),
  setExercises: (exercises) =>
    set({ exercises, lastQuestion: exercises.length - 1 }),
  increaseCurrentExerciseIndex: () =>
    set((state) => ({
      currentExerciseIndex: Math.min(
        state.currentExerciseIndex + 1,
        state.exercises.length - 1
      ),
    })),
  decreaseCurrentExerciseIndex: () =>
    set((state) => ({
      currentExerciseIndex: Math.max(state.currentExerciseIndex - 1, 0),
    })),
  setElapsedTime: (time) => set({ elapsedTime: time }),
}));
