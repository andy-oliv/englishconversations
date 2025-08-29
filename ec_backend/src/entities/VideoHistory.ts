export default interface VideoHistory {
  userId: string;
  videoId: string;
  progress: string;
  watchedDuration?: number;
  watchedCount: number;
  lastWatchedAt?: Date;
  startedAt?: Date;
}
