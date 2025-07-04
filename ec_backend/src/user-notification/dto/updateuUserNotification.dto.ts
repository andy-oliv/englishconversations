import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class UpdateUserNotificationDTO {
  @ApiProperty({
    title: 'IsRead',
    required: false,
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsBoolean({
    message: validationMessages_EN.userNotification.isRead.isBoolean,
  })
  isRead?: boolean;

  @ApiProperty({
    title: 'ReadAt',
    required: false,
    type: 'string',
    example: '2025-10-10',
  })
  @IsOptional()
  @IsDate({
    message: validationMessages_EN.userNotification.readAt.isDate,
  })
  readAt?: Date;

  @ApiProperty({
    title: 'DeliveredViaEmail',
    required: false,
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsBoolean({
    message: validationMessages_EN.userNotification.deliveredViaEmail.isBoolean,
  })
  deliveredViaEmail?: boolean;

  @ApiProperty({
    title: 'DeliveredViaApp',
    required: false,
    type: 'boolean',
    example: false,
  })
  @IsOptional()
  @IsBoolean({
    message: validationMessages_EN.userNotification.deliveredViaApp.isBoolean,
  })
  deliveredViaApp?: boolean;
}
