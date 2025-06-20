import { NotificationTypes } from '../../../generated/prisma';

export default interface Notification {
  id?: number;
  type: NotificationTypes;
  title: string;
  content: string;
  actionUrl?: string;
  expirationDate?: Date;
}
