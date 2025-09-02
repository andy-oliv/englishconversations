import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateRecordedClassDTO {
  @ApiProperty({
    title: 'Title',
    required: false,
    type: 'string',
    example: '2025-10-01 class',
  })
  @IsOptional()
  @IsString({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.title.isString,
  })
  title?: string;

  @ApiProperty({
    title: 'RecordedAt',
    required: false,
    type: 'string',
    example: '2025-10-01',
  })
  @IsOptional()
  @IsDate({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.recordedAt
        .isDate,
  })
  recordedAt?: Date;

  @ApiProperty({
    title: 'SubjectID',
    required: false,
    type: 'number',
    example: 2,
  })
  @IsOptional()
  @IsInt({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.subjectId
        .isInt,
  })
  subjectId?: number;

  @ApiProperty({
    title: 'URL',
    required: false,
    type: 'string',
    example: 'http://google.com',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message:
        validationMessages_EN.recordedClass.createRecordedClassDTO.url.isUrl,
    },
  )
  url?: string;

  @ApiProperty({
    title: 'UserIDs',
    required: true,
    type: 'string',
    example:
      '["2c932cc1-5137-4b48-9787-742064f2b554", "5dc5c5ba-6ccb-446b-b61a-eef8ab7720ce"]',
  })
  @IsOptional()
  @IsArray({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.userIds
        .isArray,
  })
  userIds?: string[];
}
