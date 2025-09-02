import { IsIn, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';
import { MaterialTypes } from '@prisma/client';

export default class UpdateMaterialDTO {
  @ApiProperty({
    title: 'Title',
    required: false,
    type: 'string',
    example: 'Class canvas',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.material.createMaterialDTO.title.isString,
  })
  title?: string;

  @ApiProperty({
    title: 'Type',
    required: false,
    type: 'string',
    example: 'PDF',
  })
  @IsOptional()
  @IsIn(['PDF', 'SLIDESHOW', 'AUDIO', 'IMAGE', 'OTHER'], {
    message: validationMessages_EN.material.createMaterialDTO.type.isIn,
  })
  type?: MaterialTypes;

  @ApiProperty({
    title: 'SubjectID',
    required: false,
    type: 'number',
    example: 2,
  })
  @IsOptional()
  @IsInt({
    message: validationMessages_EN.material.createMaterialDTO.subjectId.isInt,
  })
  subjectId?: number;

  @ApiProperty({
    title: 'URL',
    required: false,
    type: 'string',
    example: 'http://google.com',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message: validationMessages_EN.material.createMaterialDTO.url.isUrl,
    },
  )
  url?: string;
}
