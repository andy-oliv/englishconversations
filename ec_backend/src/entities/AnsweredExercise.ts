import { Prisma } from '@prisma/client';

export default interface AnsweredExercise {
  id?: string;
  exerciseId: number;
  userId: string;
  answeredQuizId?: string;
  isRetry?: boolean;
  selectedAnswers?: Prisma.JsonValue;
  textAnswer?: string;
  isCorrectAnswer?: boolean;
  feedback?: string;
  elapsedTime: number; //in seconds
}
