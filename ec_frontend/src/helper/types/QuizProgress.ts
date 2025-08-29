import type ExerciseProgress from "./ExerciseProgress";

export default interface QuizProgress {
  quizId: string | null;
  userId: string | undefined;
  score: number;
  elapsedTime: number;
  userContentId: number | undefined;
  answers: ExerciseProgress[];
  isTest: boolean;
  isPassed: boolean;
}
