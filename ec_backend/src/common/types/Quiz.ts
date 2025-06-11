import { CEFRLevels, Difficulty } from '../../../generated/prisma';

export default interface Quiz {
  id?: string;
  isTest?: boolean;
  title: string;
  description: string;
  imageUrl?: string;
  level: CEFRLevels;
  difficulty: Difficulty;
}
