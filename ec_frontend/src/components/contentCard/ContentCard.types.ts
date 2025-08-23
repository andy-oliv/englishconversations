export default interface ContentCardProps {
  id: number;
  contentId: string;
  userContentId: number;
  title: string;
  description: string;
  contentType: ContentType;
  isLocked: boolean;
  notes: string;
  isFavorite: boolean;
  isComplete: boolean;
}

export type ContentType = "VIDEO" | "QUIZ" | "SLIDESHOW" | "TEST";
