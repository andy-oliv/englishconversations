import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import validationMessages_EN from 'src/helper/messages/validationMessages.en';

export default class CompleteContentDTO {
  @ApiProperty({
    title: 'VideoID',
    required: false,
    type: 'string',
    example: '716e52b9-824b-419e-afa2-f02f2e5808c3',
  })
  @IsOptional()
  @IsUUID('all', {
    message:
      validationMessages_EN.userContent.completeContentDTO.videoId.isUUID,
  })
  videoId?: string;

  @ApiProperty({
    title: 'WatchedDuration',
    description: 'duration in seconds',
    required: false,
    type: 'number',
    example: 900,
  })
  @IsOptional()
  @IsInt({
    message:
      validationMessages_EN.userContent.completeContentDTO.watchedDuration
        .isInt,
  })
  watchedDuration?: number;

  @ApiProperty({
    title: 'StartedAt',
    required: false,
    type: 'string',
    example: '2015-04-09 14:07:46',
  })
  @IsOptional()
  @IsDate({
    message:
      validationMessages_EN.userContent.completeContentDTO.startedAt.isDate,
  })
  startedAt?: string;

  @ApiProperty({
    title: 'SlideshowID',
    required: false,
    type: 'string',
    example: '716e52b9-824b-419e-afa2-f02f2e5808c3',
  })
  @IsOptional()
  @IsUUID('all', {
    message:
      validationMessages_EN.userContent.completeContentDTO.slideshowId.isUUID,
  })
  slideshowId?: string;
}
