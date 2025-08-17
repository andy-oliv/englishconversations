import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateVideoDTO {
  @ApiProperty({
    title: 'Title',
    required: false,
    type: 'string',
    example: 'Simple what?! A guide to simple present usage',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.video.generateVideoDTO.title.isString,
  })
  title?: string;

  @ApiProperty({
    title: 'Description',
    required: false,
    type: 'string',
    example: 'new video!',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.video.generateVideoDTO.description.isString,
  })
  description?: string;

  @ApiProperty({
    title: 'URL',
    required: false,
    type: 'string',
    example: 'https://google.com',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message: validationMessages_EN.video.generateVideoDTO.url.isUrl,
    },
  )
  url?: string;

  @ApiProperty({
    title: 'Duration',
    required: false,
    type: 'number',
    example: 1200,
  })
  @IsOptional()
  @IsInt({
    message: validationMessages_EN.video.generateVideoDTO.duration.isInt,
  })
  duration?: number;

  @ApiProperty({
    title: 'ThumbnailUrl',
    required: false,
    type: 'string',
    example: 'eda07b8a-6170-4dad-aa5d-bdc3d3d4aadb',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message: validationMessages_EN.video.generateVideoDTO.thumbnailUrl.isUrl,
    },
  )
  thumbnailUrl?: string;
}
