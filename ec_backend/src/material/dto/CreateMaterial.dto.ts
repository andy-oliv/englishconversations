import { MaterialTypes } from '@prisma/client';
import { IsIn, IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateMaterialDTO {
  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'Class canvas',
  })
  @IsNotEmpty({
    message: validationMessages_EN.material.createMaterialDTO.title.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.material.createMaterialDTO.title.isString,
  })
  title: string;

  @ApiProperty({
    title: 'Type',
    required: true,
    type: 'string',
    example: 'PDF',
  })
  @IsNotEmpty({
    message: validationMessages_EN.material.createMaterialDTO.title.isNotEmpty,
  })
  @IsIn(['PDF', 'SLIDESHOW', 'AUDIO', 'IMAGE', 'OTHER'], {
    message: validationMessages_EN.material.createMaterialDTO.type.isIn,
  })
  type: MaterialTypes;

  @ApiProperty({
    title: 'SubjectID',
    required: true,
    type: 'number',
    example: 2,
  })
  @IsNotEmpty({
    message: validationMessages_EN.material.createMaterialDTO.title.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.material.createMaterialDTO.subjectId.isInt,
  })
  subjectId: number;

  @ApiProperty({
    title: 'URL',
    required: true,
    type: 'string',
    example: 'http://google.com',
  })
  @IsNotEmpty({
    message: validationMessages_EN.material.createMaterialDTO.title.isNotEmpty,
  })
  @IsUrl(
    {},
    {
      message: validationMessages_EN.material.createMaterialDTO.url.isUrl,
    },
  )
  url: string;
}
