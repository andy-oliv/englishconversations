import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class GenerateChapterDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'A1',
  })
  @IsNotEmpty({
    message: validationMessages_EN.chapter.generateChapterDTO.name.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.chapter.generateChapterDTO.name.isString,
  })
  name: string;

  @ApiProperty({
    title: 'Description',
    required: true,
    type: 'string',
    example: 'fundamentals',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.chapter.generateChapterDTO.description.isNotEmpty,
  })
  @IsString({
    message:
      validationMessages_EN.chapter.generateChapterDTO.description.isString,
  })
  description: string;

  @ApiProperty({
    title: 'ImageUrl',
    required: true,
    type: 'string',
    example: '1fljv240)*$k4dl10jf',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message: validationMessages_EN.chapter.generateChapterDTO.imageUrl.isUrl,
    },
  )
  imageUrl?: string;
}
