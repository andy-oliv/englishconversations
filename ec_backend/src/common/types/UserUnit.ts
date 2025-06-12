import { UnitStatus } from '../../../generated/prisma';

export default interface UserUnit {
  id?: string;
  userId: string;
  unitId: number;
  status?: UnitStatus;
  progress?: number;
  completedAt?: Date;
}
