export default interface SlideshowProgress {
  userId: string;
  slideshowId: string;
  status?: Status;
  progress?: number;
  userContentId: number;
}

type Status = "LOCKED" | "IN_PROGRESS" | "COMPLETED";
