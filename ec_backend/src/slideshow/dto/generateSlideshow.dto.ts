import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class GenerateSlideShowDTO {
  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'Unit 1 - Past Simple',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.slideshow.generateSlideshowDTO.title.isNotEmpty,
  })
  @IsString({
    message:
      validationMessages_EN.slideshow.generateSlideshowDTO.title.isString,
  })
  title: string;

  @ApiProperty({
    title: 'Description',
    required: true,
    type: 'string',
    example: 'Learning past simple with ease',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.slideshow.generateSlideshowDTO.title.isNotEmpty,
  })
  @IsString({
    message:
      validationMessages_EN.slideshow.generateSlideshowDTO.title.isString,
  })
  description: string;
}
