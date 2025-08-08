import { ApiProperty } from '@nestjs/swagger';
import { SlideType } from '../../../generated/prisma';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class UpdateSlideDTO {
  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'Unit 1 - Past Simple',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.Slide.generateSlideDTO.title.isString,
  })
  title?: string;

  @ApiProperty({
    title: 'Description',
    required: true,
    type: 'string',
    example: 'Learn the past simple tense easily.',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.Slide.generateSlideDTO.description.isString,
  })
  description?: string;

  @ApiProperty({
    title: 'Type',
    required: true,
    type: 'string',
    example: 'IMAGE',
  })
  @IsOptional()
  @IsIn(['IMAGE', 'VIDEO'], {
    message: validationMessages_EN.Slide.generateSlideDTO.type.isIn,
  })
  type?: SlideType;

  @ApiProperty({
    title: 'URL',
    required: true,
    type: 'string',
    example: 'https://google.com/images',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message: validationMessages_EN.Slide.generateSlideDTO.url.isUrl,
    },
  )
  url?: string;

  @ApiProperty({
    title: 'Order',
    required: true,
    type: 'number',
    example: 1,
  })
  @IsOptional()
  @IsInt({
    message: validationMessages_EN.Slide.generateSlideDTO.order.isInt,
  })
  order?: number;
}
