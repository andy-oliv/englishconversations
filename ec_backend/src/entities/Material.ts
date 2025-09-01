import { MaterialTypes } from '@prisma/client';

export default interface Material {
  id?: string;
  title: string;
  type: MaterialTypes;
  subjectId: number;
  url: string;
}
