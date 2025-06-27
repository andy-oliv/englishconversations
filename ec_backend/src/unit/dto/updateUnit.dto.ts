import { IsOptional, IsString, IsUUID } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateUnitDTO {
  @ApiProperty({
    title: 'Name',
    required: false,
    type: 'string',
    example: 'test unit',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.unit.createUnitDTO.name.isString,
  })
  name: string;

  @ApiProperty({
    title: 'Description',
    required: false,
    type: 'string',
    example: 'test',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.unit.createUnitDTO.description.isString,
  })
  description: string;

  @ApiProperty({
    title: 'FileID',
    required: false,
    type: 'string',
    example: '77988c17-0e05-4ac3-96f3-a3ba16c0709f',
  })
  @IsOptional()
  @IsUUID('all', {
    message: validationMessages_EN.unit.createUnitDTO.fileId.isUUID,
  })
  fileId?: string;

  @ApiProperty({
    title: 'ChapterID',
    required: false,
    type: 'string',
    example: '77988c17-0e05-4ac3-96f3-a3ba16c0709f',
  })
  @IsOptional()
  @IsUUID('all', {
    message: validationMessages_EN.unit.createUnitDTO.chapterId.isUUID,
  })
  chapterId: string;
}
