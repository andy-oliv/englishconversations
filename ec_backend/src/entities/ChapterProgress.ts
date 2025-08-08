import { Status } from '../../generated/prisma';

export default interface ChapterProgress {
  status: Status;
  id: string;
  chapter: {
    description: string;
    id: string;
    name: string;
  };
  progress: number;
}
