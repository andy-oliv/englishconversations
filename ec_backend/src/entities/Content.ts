import { ContentTypes } from '@prisma/client';

export default interface Content {
  id?: number;
  unitId: number;
  contentType: ContentTypes;
  videoId?: string;
  slideshowId?: string;
  quizId?: string;
  order?: number;
}
