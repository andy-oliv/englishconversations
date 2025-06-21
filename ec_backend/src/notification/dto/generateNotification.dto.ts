import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { NotificationTypes } from '../../../generated/prisma';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class GenerateNotificationDTO {
  @ApiProperty({
    title: 'Type',
    required: true,
    type: 'string',
    example: 'INFO',
  })
  @IsNotEmpty({
    message: validationMessages_EN.notification.type.isNotEmpty,
  })
  @IsIn(['INFO', 'REMINDER', 'ALERT'], {
    message: validationMessages_EN.notification.type.isIn,
  })
  type: NotificationTypes;

  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'Congratulations!',
  })
  @IsNotEmpty({
    message: validationMessages_EN.notification.title.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.notification.title.isString,
  })
  title: string;

  @ApiProperty({
    title: 'Content',
    required: false,
    type: 'string',
    example: 'You have just completed chapter A1!',
  })
  @IsNotEmpty({
    message: validationMessages_EN.notification.content.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.notification.content.isString,
  })
  content: string;

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
