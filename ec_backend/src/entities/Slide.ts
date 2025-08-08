import { SlideType } from '@prisma/client';

export default interface Slide {
  id?: string;
  slideshowId: string;
  title: string;
  description: string;
  type: SlideType;
  url: string;
  order: number;
}
