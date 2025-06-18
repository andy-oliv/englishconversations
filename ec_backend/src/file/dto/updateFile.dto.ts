import { IsIn, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';
import { FileTypes } from '../../../generated/prisma';

export default class UpdateFileDTO {
  @ApiProperty({
    title: 'Name',
    required: false,
    type: 'string',
    example: 'thumbnail.jpg',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.file.generateFileDTO.name.isString,
  })
  name?: string;

  @ApiProperty({
    title: 'Type',
    required: false,
    type: 'string',
    example: 'IMAGE',
  })
  @IsOptional()
  @IsIn(['PDF', 'AUDIO', 'IMAGE'], {
    message: validationMessages_EN.file.generateFileDTO.type.isIn,
  })
  type?: FileTypes;

  @ApiProperty({
    title: 'URL',
    required: false,
    type: 'string',
    example: 'https://google.com',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message: validationMessages_EN.file.generateFileDTO.url.isUrl,
    },
  )
  url?: string;

  @ApiProperty({
    title: 'Size',
    required: false,
    type: 'number',
    example: 1000,
  })
  @IsOptional()
  @IsInt({
    message: validationMessages_EN.file.generateFileDTO.size.isInt,
  })
  size?: number;
}
