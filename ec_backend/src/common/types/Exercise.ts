import {
  CEFRLevels,
  Difficulty,
  ExerciseTypes,
} from '../../../generated/prisma';

export default interface Exercise {
  id?: number;
  type: ExerciseTypes;
  description: string;
  level: CEFRLevels;
  difficulty: Difficulty;
  options?: string[] | number[]; //optional field because the 'match the columns' exercises don't have predefined answers
  correctAnswer: string | number[];
}
