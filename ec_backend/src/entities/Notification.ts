import { NotificationTypes } from '@prisma/client';

export default interface Notification {
  id?: number;
  type: NotificationTypes;
  title: string;
  content: string;
  actionUrl?: string;
  expirationDate?: Date;
}
