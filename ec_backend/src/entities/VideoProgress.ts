export default interface VideoProgress {
  id?: number;
  userId: string;
  videoId: string;
  progress?: number; //percentage watched
  watchedDuration?: number; //duration in seconds
  watchedCount?: number;
  lastWatchedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  completed?: boolean;
  isFavorite?: boolean;
  note?: string;
}
