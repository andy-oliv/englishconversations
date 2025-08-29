import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class GenerateVideoProgressDTO {
  @ApiProperty({
    title: 'UserID',
    required: true,
    type: 'string',
    example: '35ba4515-4ece-43f3-bb55-8a632aaaa873',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.userId
        .isNotEmpty,
  })
  @IsUUID('all', {
    message:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.userId
        .isUUID,
  })
  userId: string;

  @ApiProperty({
    title: 'VideoID',
    required: true,
    type: 'string',
    example: '47d96219-e87a-4089-8718-93b469eeb40b',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.videoId
        .isNotEmpty,
  })
  @IsUUID('all', {
    message:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.videoId
        .isUUID,
  })
  videoId: string;

  @ApiProperty({
    title: 'UserContentId',
    required: true,
    type: 'number',
    example: 2,
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.userContentId
        .isNotEmpty,
  })
  @IsInt({
    message:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.userContentId
        .isInt,
  })
  userContentId: number;

  @ApiProperty({
    title: 'Progress',
    required: false,
    type: 'number',
    example: 50,
  })
  @IsOptional()
  @IsInt({
    message:
      validationMessages_EN.videoProgress.updateVideoProgressDTO.progress.isInt,
  })
  progress?: number;

  @ApiProperty({
    title: 'WatchedDuration',
    required: false,
    type: 'number',
    example: 120,
  })
  @IsOptional()
  @IsInt({
    message:
      validationMessages_EN.videoProgress.updateVideoProgressDTO.watchedDuration
        .isInt,
  })
  watchedDuration?: number;

  @ApiProperty({
    title: 'WatchedCount',
    required: false,
    type: 'number',
    example: 3,
  })
  @IsOptional()
  @IsInt({
    message:
      validationMessages_EN.videoProgress.updateVideoProgressDTO.watchedCount
        .isInt,
  })
  watchedCount?: number;

  @ApiProperty({
    title: 'LastWatchedAt',
    required: false,
    type: 'string',
    example: '2025-06-28',
  })
  @IsOptional()
  @IsDate({
    message:
      validationMessages_EN.videoProgress.updateVideoProgressDTO.lastWatchedAt
        .isDate,
  })
  lastWatchedAt?: Date;

  @ApiProperty({
    title: 'StartedAt',
    required: false,
    type: 'string',
    example: '2025-06-10',
  })
  @IsOptional()
  @IsDate({
    message:
      validationMessages_EN.videoProgress.updateVideoProgressDTO.startedAt
        .isDate,
  })
  startedAt?: Date;

  @ApiProperty({
    title: 'CompletedAt',
    required: false,
    type: 'string',
    example: '2025-06-10',
  })
  @IsOptional()
  @IsDate({
    message:
      validationMessages_EN.videoProgress.updateVideoProgressDTO.completedAt
        .isDate,
  })
  completedAt?: Date;

  @ApiProperty({
    title: 'Completed',
    required: false,
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsBoolean({
    message:
      validationMessages_EN.videoProgress.updateVideoProgressDTO.completed
        .isBoolean,
  })
  completed?: boolean;

  @ApiProperty({
    title: 'VideoID',
    required: false,
    type: 'string',
    example: '47d96219-e87a-4089-8718-93b469eeb40b',
  })
  @IsOptional()
  @IsBoolean({
    message:
      validationMessages_EN.videoProgress.updateVideoProgressDTO.isFavorite
        .isBoolean,
  })
  isFavorite?: boolean;

  @ApiProperty({
    title: 'VideoID',
    required: false,
    type: 'string',
    example: 'great video!',
  })
  @IsOptional()
  @IsString({
    message:
      validationMessages_EN.videoProgress.updateVideoProgressDTO.note.isString,
  })
  note?: string;
}
