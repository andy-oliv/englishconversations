import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class GenerateVideoDTO {
  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'Simple what?! A guide to simple present usage',
  })
  @IsNotEmpty({
    message: validationMessages_EN.video.generateVideoDTO.title.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.video.generateVideoDTO.title.isString,
  })
  title: string;

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
    required: true,
    type: 'string',
    example: 'https://google.com',
  })
  @IsNotEmpty({
    message: validationMessages_EN.video.generateVideoDTO.url.isNotEmpty,
  })
  @IsUrl(
    {},
    {
      message: validationMessages_EN.video.generateVideoDTO.url.isUrl,
    },
  )
  url: string;

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
    title: 'ThumbnailID',
    required: false,
    type: 'string',
    example: 'eda07b8a-6170-4dad-aa5d-bdc3d3d4aadb',
  })
  @IsOptional()
  @IsUUID('all', {
    message: validationMessages_EN.video.generateVideoDTO.thumbnailId.isUUID,
  })
  thumbnailId?: string;

  @ApiProperty({
    title: 'UnitID',
    required: false,
    type: 'number',
    example: 2,
  })
  @IsOptional()
  @IsInt({
    message: validationMessages_EN.video.generateVideoDTO.duration.isInt,
  })
  unitId?: number;
}
