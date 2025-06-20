export default interface UserNotification {
  id?: string;
  userId: string;
  notificationId: number;
  isRead?: boolean;
  deliveredAt: Date;
  readAt?: Date;
  deliveredViaEmail?: boolean;
  deliveredViaApp?: boolean;
}
