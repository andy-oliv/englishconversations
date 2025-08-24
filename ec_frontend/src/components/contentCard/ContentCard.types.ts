export default interface ContentCardProps {
  contentId: number;
  title: string;
  description: string;
  contentType: ContentType;
  isLocked: boolean;
  interactiveContentId: string;
}

export type ContentType = "VIDEO" | "QUIZ" | "SLIDESHOW" | "TEST";
