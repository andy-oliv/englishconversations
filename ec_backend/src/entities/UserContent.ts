import { Status } from '@prisma/client';

export default interface UserContent {
  id?: number;
  userId: string;
  contentId: number;
  status?: Status;
  progress?: number;
}
