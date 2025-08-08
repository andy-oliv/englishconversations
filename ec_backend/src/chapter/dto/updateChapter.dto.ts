import { IsOptional, IsString, IsUrl } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateChapterDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'A1',
  })
  @IsOptional()
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
  @IsOptional()
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
