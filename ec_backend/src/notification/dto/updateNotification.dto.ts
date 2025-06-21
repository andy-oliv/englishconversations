import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { NotificationTypes } from '../../../generated/prisma';

export default class UpdateNotificationDTO {
  @ApiProperty({
    title: 'Type',
    required: true,
    type: 'string',
    example: 'INFO',
  })
  @IsOptional()
  @IsIn(['INFO', 'REMINDER', 'ALERT'], {
    message: validationMessages_EN.notification.type.isIn,
  })
  type?: NotificationTypes;

  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'Congratulations!',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.notification.title.isString,
  })
  title?: string;

  @ApiProperty({
    title: 'Content',
    required: false,
    type: 'string',
    example: 'You have just completed chapter A1!',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.notification.content.isString,
  })
  content?: string;

  @ApiProperty({
    title: 'ActionURL',
    required: false,
    type: 'string',
    example: 'https://google.com',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message: validationMessages_EN.notification.actionUrl.isUrl,
    },
  )
  actionUrl?: string;

  @ApiProperty({
    title: 'ExpirationDate',
    required: false,
    type: 'string',
    example: '2025-07-16',
  })
  @IsOptional()
  @IsDate({
    message: validationMessages_EN.notification.expirationDate.isDate,
  })
  expirationDate?: Date;
}
