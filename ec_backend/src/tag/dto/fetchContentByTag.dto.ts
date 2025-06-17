import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';
import { ContentType } from '../../common/types/ContentType';

export default class FetchContentByTag {
  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'present simple',
  })
  @IsNotEmpty({
    message: validationMessages_EN.tag.fetchContentByTag.title.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.tag.fetchContentByTag.title.isString,
  })
  title: string;

  @ApiProperty({
    title: 'ContentType',
    required: false,
    type: 'string',
    example: 'exercise',
  })
  @IsOptional()
  @IsIn(['exercise', 'quiz', 'unit', 'video'], {
    message: validationMessages_EN.tag.fetchContentByTag.contentType.isIn,
  })
  contentType: ContentType;
}
