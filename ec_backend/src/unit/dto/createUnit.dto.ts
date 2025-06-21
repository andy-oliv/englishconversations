import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateUnitDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'test unit',
  })
  @IsNotEmpty({
    message: validationMessages_EN.unit.createUnitDTO.name.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.unit.createUnitDTO.name.isString,
  })
  name: string;

  @ApiProperty({
    title: 'Description',
    required: true,
    type: 'string',
    example: 'test',
  })
  @IsNotEmpty({
    message: validationMessages_EN.unit.createUnitDTO.description.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.unit.createUnitDTO.description.isString,
  })
  description: string;

  @ApiProperty({
    title: 'ChapterID',
    required: true,
    type: 'string',
    example: '77988c17-0e05-4ac3-96f3-a3ba16c0709f',
  })
  @IsNotEmpty({
    message: validationMessages_EN.unit.createUnitDTO.chapterId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.unit.createUnitDTO.chapterId.isUUID,
  })
  chapterId: string;
}
