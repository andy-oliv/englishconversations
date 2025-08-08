import { Status } from '../../generated/prisma';

export default interface SlideshowProgress {
  id?: string;
  userId: string;
  slideshowId: string;
  status?: Status;
  progress?: number;
}
