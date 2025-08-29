export default interface VideoProgress {
  userId: string;
  videoId: string;
  progress?: number;
  watchedDuration?: number;
  watchedCount?: number;
  lastWatchedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  completed?: boolean;
  isFavorite?: boolean;
  note?: string;
  userContentId: number;
}
