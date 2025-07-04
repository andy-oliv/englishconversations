import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class generateUserNotificationDTO {
  @ApiProperty({
    title: 'UserID',
    required: true,
    type: 'string',
    example: '$F0g9219*',
  })
  @IsNotEmpty({
    message: validationMessages_EN.userNotification.userId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.userNotification.userId.isUUID,
  })
  userId: string;

  @ApiProperty({
    title: 'NotificationID',
    required: true,
    type: 'string',
    example: '10854fkfa8**93mNN',
  })
  @IsNotEmpty({
    message: validationMessages_EN.userNotification.notificationId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.userNotification.notificationId.isInt,
  })
  notificationId: number;
}
