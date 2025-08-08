import { Status } from '../../generated/prisma';

export default interface UnitProgress {
  status: Status;
  id: string;
  unit: {
    id: number;
    description: string;
    name: string;
  };
  progress: number;
}
