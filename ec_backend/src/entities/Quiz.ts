import { CEFRLevels, Difficulty } from '../../generated/prisma';

export default interface Quiz {
  id?: string;
  isTest?: boolean;
  title: string;
  description: string;
  fileId?: string;
  level?: CEFRLevels;
  difficulty: Difficulty;
  unitId?: number;
}
