import { Prisma } from '@prisma/client';

export default interface QuizHistory {
  quizId: string;
  userId: string;
  isTest?: boolean;
  answers: Prisma.JsonValue;
  score: number;
  isPassed?: boolean;
  feedback?: string;
  elapsedTime: number;
  attemptNumber: number;
}
