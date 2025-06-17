import { IsNotEmpty, IsString } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateTagDTO {
  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'present simple',
  })
  @IsNotEmpty({
    message: validationMessages_EN.tag.createTagDTO.title.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.tag.createTagDTO.title.isString,
  })
  title: string;
}
