import { create } from "zustand";
import type { Exercise } from "../schemas/exercise.schema";

export interface Answer {
  exerciseId: number;
  answer: string[];
  isAnswered: boolean;
  elapsedTime: number;
}

interface QuizAnswerStoreState {
  userId: string | null;
  quizId: string | null;
  answers: Record<number, Answer>;
  setUserId: (userId: string) => void;
  setQuizId: (quizId: string) => void;
  prepareAnswers: (exercises: Exercise[]) => void;
  setAnswer: (
    exerciseId: number,
    answer: string[],
    isAnswered: boolean,
    elapsedTime: number
  ) => void;
  getAnswer: (exerciseId: number) => Answer;
  reset: () => void;
}

export const useQuizAnswerStore = create<QuizAnswerStoreState>((set, get) => ({
  userId: null,
  quizId: null,
  answers: {},
  setUserId: (userId) => set({ userId }),
  setQuizId: (quizId) => set({ quizId }),
  prepareAnswers: (exercises) => {
    const answers: Record<number, Answer> = {};
    exercises.forEach((exercise) => {
      answers[exercise.id] = {
        exerciseId: exercise.id,
        answer: [],
        isAnswered: false,
        elapsedTime: 0,
      };
    });
    set({ answers });
  },
  setAnswer: (exerciseId, answer, isAnswered, elapsedTime) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [exerciseId]: {
          exerciseId,
          answer,
          isAnswered,
          elapsedTime,
        },
      },
    })),
  getAnswer: (exerciseId) => get().answers[exerciseId],
  reset: () => set({ userId: null, quizId: null, answers: {} }),
}));
