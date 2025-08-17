import { ContentTypes } from '@prisma/client';

export default interface CurrentChapter {
  chapter: {
    description: string;
    imageUrl: string;
    name: string;
    units: {
      id: number;
      name: string;
      description: string;
      imageUrl: string;
      contents: {
        id: number;
        contentType: ContentTypes;
        slideshow: {
          title: string;
          description: string;
        };
        video: {
          title: string;
          description: string;
        };
        quiz: {
          title: string;
          description: string;
          isTest: boolean;
        };
      }[];
    }[];
  };
}
