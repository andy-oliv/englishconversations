import { ApiProperty } from '@nestjs/swagger';
import { SlideType } from '@prisma/client';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class GenerateSlideDTO {
  @ApiProperty({
    title: 'SlideshowID',
    required: true,
    type: 'string',
    example: '0df0a1e2-1347-4d19-8d93-7aa0c29f9329',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.Slide.generateSlideDTO.slideshowId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.Slide.generateSlideDTO.slideshowId.isUUID,
  })
  slideshowId: string;

  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'Unit 1 - Past Simple',
  })
  @IsNotEmpty({
    message: validationMessages_EN.Slide.generateSlideDTO.title.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.Slide.generateSlideDTO.title.isString,
  })
  title: string;

  @ApiProperty({
    title: 'Description',
    required: true,
    type: 'string',
    example: 'Learn the past simple tense easily.',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.Slide.generateSlideDTO.description.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.Slide.generateSlideDTO.description.isString,
  })
  description: string;

  @ApiProperty({
    title: 'Type',
    required: true,
    type: 'string',
    example: 'IMAGE',
  })
  @IsNotEmpty({
    message: validationMessages_EN.Slide.generateSlideDTO.type.isNotEmpty,
  })
  @IsIn(['IMAGE', 'VIDEO'], {
    message: validationMessages_EN.Slide.generateSlideDTO.type.isIn,
  })
  type: SlideType;

  @ApiProperty({
    title: 'URL',
    required: true,
    type: 'string',
    example: 'https://google.com/images',
  })
  @IsNotEmpty({
    message: validationMessages_EN.Slide.generateSlideDTO.url.isNotEmpty,
  })
  @IsUrl(
    {},
    {
      message: validationMessages_EN.Slide.generateSlideDTO.url.isUrl,
    },
  )
  url: string;

  @ApiProperty({
    title: 'Order',
    required: true,
    type: 'number',
    example: 1,
  })
  @IsNotEmpty({
    message: validationMessages_EN.Slide.generateSlideDTO.order.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.Slide.generateSlideDTO.order.isInt,
  })
  order: number;
}
