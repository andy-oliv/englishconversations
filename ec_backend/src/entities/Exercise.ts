import {
  CEFRLevels,
  Difficulty,
  ExerciseTypes,
  Prisma,
} from '../../generated/prisma';

export default interface Exercise {
  id?: number;
  type: ExerciseTypes;
  description: string;
  fileId?: string;
  level: CEFRLevels;
  difficulty: Difficulty;
  options?: Prisma.JsonValue; //optional field because the 'match the columns' exercises don't have predefined answers
  correctAnswer: Prisma.JsonValue;
  quizId?: string;
}
