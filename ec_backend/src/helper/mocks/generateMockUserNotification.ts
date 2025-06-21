import { faker } from '@faker-js/faker/.';
import UserNotification from '../../common/types/UserNotification';

export default function generateMockUserNotification(): UserNotification {
  const notification: UserNotification = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    notificationId: faker.number.int(),
    deliveredAt: faker.date.anytime(),
    isRead: faker.datatype.boolean(),
    readAt: faker.date.future(),
    deliveredViaApp: faker.datatype.boolean(),
    deliveredViaEmail: faker.datatype.boolean(),
  };

  return notification;
}
