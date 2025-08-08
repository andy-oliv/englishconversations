import { Status } from '@prisma/client';

export default interface UserChapter {
  id?: string;
  userId: string;
  chapterId: string;
  status?: Status;
  progress?: number;
  completedAt?: Date;
}
