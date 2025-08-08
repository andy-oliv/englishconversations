import { CEFRLevels, Difficulty, ExerciseTypes, Prisma } from '@prisma/client';

//since MySQL doesn't accept the use of arrays as valid data types, Prisma.JsonValue is the type that allows the use of arrays

export default interface Exercise {
  id?: number;
  type: ExerciseTypes;
  description: string;
  columnA?: Prisma.JsonValue; //optional field for 'match the columns' exercises
  columnB?: Prisma.JsonValue; //optional field for 'match the columns' exercises
  contentUrl?: string;
  level: CEFRLevels;
  difficulty: Difficulty;
  options?: Prisma.JsonValue; //optional field because the 'match the columns' exercises don't have predefined answers
  correctAnswer: Prisma.JsonValue;
  quizId?: string;
}
