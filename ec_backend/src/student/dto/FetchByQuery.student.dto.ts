import { IsOptional, IsString } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class FetchByQueryDTO {
  @ApiProperty({
    title: 'City',
    required: false,
    type: 'string',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.students.registerStudentDTO.city.isString,
  })
  city: string;

  @ApiProperty({
    title: 'State',
    required: false,
    type: 'string',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.students.registerStudentDTO.state.isString,
  })
  state: string;

  @ApiProperty({
    title: 'Country',
    required: false,
    type: 'string',
    example: 'Brasil',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.students.registerStudentDTO.country.isString,
  })
  country: string;
}
