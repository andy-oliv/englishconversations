import { Status } from '../../generated/prisma';

export default interface UserUnit {
  id?: string;
  userId: string;
  unitId: number;
  status?: Status;
  progress?: number;
  completedAt?: Date;
}
