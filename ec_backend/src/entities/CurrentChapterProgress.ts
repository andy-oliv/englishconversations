import { ContentTypes, Status } from '@prisma/client';

export default interface CurrentChapterProgress {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  order: number;
  chapterId: string;
  createdAt: Date;
  updatedAt: Date;
  unitProgress: { id: string; progress: number; status: Status } | null;
  contents: {
    id: number;
    contentType: ContentTypes;
    order: number;
    quiz?: { id: string; isTest: boolean; title: string; description: string };
    video?: { id: string; title: string; description: string };
    slideshow?: { id: string; title: string; description: string };
    contentProgress: {
      id: number;
      contentId: number;
      progress: number;
      status: Status;
    } | null;
  }[];
}
