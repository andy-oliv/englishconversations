import { faker } from '@faker-js/faker/.';
import Notification from '../../common/types/Notification';
import { NotificationTypes } from '../../../generated/prisma';

export default function generateMockNotification(): Notification {
  const notification: Notification = {
    id: faker.number.int(),
    type: getRandomNotificationType(),
    title: faker.book.title(),
    content: faker.person.bio(),
    actionUrl: faker.internet.url(),
    expirationDate: faker.date.anytime(),
  };

  return notification;
}

function getRandomNotificationType(): NotificationTypes {
  const notificationTypes: any = ['INFO', 'REMINDER', 'ALERT'];

  const type: NotificationTypes =
    notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

  return type;
}
