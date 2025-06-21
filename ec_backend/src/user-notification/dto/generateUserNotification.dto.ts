import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class generateUserNotificationDTO {
  @IsNotEmpty({
    message: validationMessages_EN.userNotification.userId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.userNotification.userId.isUUID,
  })
  userId: string;

  @IsNotEmpty({
    message: validationMessages_EN.userNotification.notificationId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.userNotification.notificationId.isInt,
  })
  notificationId: number;
}
