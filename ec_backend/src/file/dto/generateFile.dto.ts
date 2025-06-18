import { IsIn, IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';
import { FileTypes } from '../../../generated/prisma';

export default class GenerateFileDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'thumbnail.jpg',
  })
  @IsNotEmpty({
    message: validationMessages_EN.file.generateFileDTO.name.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.file.generateFileDTO.name.isString,
  })
  name: string;

  @ApiProperty({
    title: 'Type',
    required: true,
    type: 'string',
    example: 'IMAGE',
  })
  @IsNotEmpty({
    message: validationMessages_EN.file.generateFileDTO.type.isNotEmpty,
  })
  @IsIn(['PDF', 'AUDIO', 'IMAGE'], {
    message: validationMessages_EN.file.generateFileDTO.type.isIn,
  })
  type: FileTypes;

  @ApiProperty({
    title: 'URL',
    required: true,
    type: 'string',
    example: 'https://google.com',
  })
  @IsNotEmpty({
    message: validationMessages_EN.file.generateFileDTO.url.isNotEmpty,
  })
  @IsUrl(
    {},
    {
      message: validationMessages_EN.file.generateFileDTO.url.isUrl,
    },
  )
  url: string;

  @ApiProperty({
    title: 'Size',
    required: true,
    type: 'number',
    example: 1000,
  })
  @IsNotEmpty({
    message: validationMessages_EN.file.generateFileDTO.size.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.file.generateFileDTO.size.isInt,
  })
  size: number;
}
