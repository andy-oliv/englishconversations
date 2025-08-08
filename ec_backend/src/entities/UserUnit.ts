import { Status } from '@prisma/client';

export default interface UserUnit {
  id?: string;
  userId: string;
  unitId: number;
  status?: Status;
  progress?: number;
  completedAt?: Date;
}
