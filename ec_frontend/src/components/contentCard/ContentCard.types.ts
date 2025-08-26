export default interface ContentCardProps {
  contentId: number;
  title: string;
  description: string;
  contentType: ContentType;
  isLocked: boolean;
  interactiveContentId: string;
  isCompleted: boolean;
}

export type ContentType = "VIDEO" | "QUIZ" | "SLIDESHOW" | "TEST";
