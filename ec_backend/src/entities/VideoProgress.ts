export default interface VideoProgress {
  id?: number;
  userId: string;
  videoId: string;
  progress?: number;
  watchedDuration?: number;
  watchedCoun?: number;
  lastWatchedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  completed?: boolean;
  isFavorite?: boolean;
  note?: string;
}
