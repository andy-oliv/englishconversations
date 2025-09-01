import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class CreateSubjectDTO {
  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'past simple',
  })
  @IsNotEmpty({
    message: validationMessages_EN.subject.createSubjectDTO.title.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.subject.createSubjectDTO.title.isString,
  })
  title: string;
}
