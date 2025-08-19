import { Status } from '@prisma/client';

export default interface SlideshowProgress {
  id?: string;
  userId: string;
  slideshowId: string;
  status?: Status;
  progress?: number;
  userContentId: number;
}
