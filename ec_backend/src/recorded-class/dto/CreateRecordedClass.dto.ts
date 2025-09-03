import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateRecordedClassDTO {
  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: '2025-10-01 class',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.title
        .isNotEmpty,
  })
  @IsString({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.title.isString,
  })
  title: string;

  @ApiProperty({
    title: 'RecordedAt',
    required: true,
    type: 'string',
    example: '2025-10-01',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.recordedAt
        .isNotEmpty,
  })
  @IsDate({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.recordedAt
        .isDate,
  })
  recordedAt: Date;

  @ApiProperty({
    title: 'SubjectID',
    required: true,
    type: 'number',
    example: 2,
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.title
        .isNotEmpty,
  })
  @IsInt({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.subjectId
        .isInt,
  })
  subjectId: number;

  @ApiProperty({
    title: 'URL',
    required: true,
    type: 'string',
    example: 'http://google.com',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.url.isNotEmpty,
  })
  @IsUrl(
    {},
    {
      message:
        validationMessages_EN.recordedClass.createRecordedClassDTO.url.isUrl,
    },
  )
  url: string;

  @ApiProperty({
    title: 'URL',
    required: true,
    type: 'string',
    example: 'http://google.com',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.thumbnailUrl
        .isNotEmpty,
  })
  @IsUrl(
    {},
    {
      message:
        validationMessages_EN.recordedClass.createRecordedClassDTO.thumbnailUrl
          .isUrl,
    },
  )
  thumbnailUrl: string;

  @ApiProperty({
    title: 'UserIDs',
    required: true,
    type: 'string',
    example:
      '["2c932cc1-5137-4b48-9787-742064f2b554", "5dc5c5ba-6ccb-446b-b61a-eef8ab7720ce"]',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.userIds
        .isNotEmpty,
  })
  @IsArray({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.userIds
        .isArray,
  })
  userIds: string[];

  @ApiProperty({
    title: 'MaterialIDs',
    required: true,
    type: 'string',
    example:
      '["2c932cc1-5137-4b48-9787-742064f2b554", "5dc5c5ba-6ccb-446b-b61a-eef8ab7720ce"]',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.materialIds
        .isNotEmpty,
  })
  @IsArray({
    message:
      validationMessages_EN.recordedClass.createRecordedClassDTO.materialIds
        .isArray,
  })
  materialIds: string[];
}
