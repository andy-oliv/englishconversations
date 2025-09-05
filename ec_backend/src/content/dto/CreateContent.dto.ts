import { ApiProperty } from '@nestjs/swagger';
import { ContentTypes } from '@prisma/client';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import validationMessages_EN from 'src/helper/messages/validationMessages.en';

export default class CreateContentDTO {
  @ApiProperty({
    title: 'UnitID',
    required: true,
    type: 'number',
    example: 1,
  })
  @IsNotEmpty({
    message: validationMessages_EN.content.createContentDTO.unitId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.content.createContentDTO.unitId.isInt,
  })
  unitId: number;

  @ApiProperty({
    title: 'ContentType',
    required: true,
    type: 'string',
    example: 'VIDEO',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.content.createContentDTO.contentType.isNotEmpty,
  })
  @IsIn(['SLIDESHOW', 'QUIZ', 'VIDEO', 'TEST'], {
    message: validationMessages_EN.content.createContentDTO.contentType.isIn,
  })
  contentType: ContentTypes;

  @ApiProperty({
    title: 'VideoId',
    required: false,
    type: 'string',
    example: 'a5fb9011-1c42-4d54-a949-4c767db592a7',
  })
  @IsOptional()
  @IsUUID('all', {
    message: validationMessages_EN.content.createContentDTO.videoId.isUUID,
  })
  videoId?: string;

  @ApiProperty({
    title: 'SlideshowId',
    required: false,
    type: 'string',
    example: 'a5fb9011-1c42-4d54-a949-4c767db592a7',
  })
  @IsOptional()
  @IsUUID('all', {
    message: validationMessages_EN.content.createContentDTO.slideshowId.isUUID,
  })
  slideshowId?: string;

  @ApiProperty({
    title: 'quizId',
    required: false,
    type: 'string',
    example: 'a5fb9011-1c42-4d54-a949-4c767db592a7',
  })
  @IsOptional()
  @IsUUID('all', {
    message: validationMessages_EN.content.createContentDTO.quizId.isUUID,
  })
  quizId?: string;
}
