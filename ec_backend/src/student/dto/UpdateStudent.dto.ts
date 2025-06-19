import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateStudentDTO {
  @ApiProperty({
    title: 'Name',
    required: false,
    type: 'string',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.students.registerStudentDTO.name.isString,
  })
  name: string;

  @ApiProperty({
    title: 'Age',
    required: false,
    type: 'number',
    example: 33,
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: validationMessages_EN.students.registerStudentDTO.age.isNumber },
  )
  age: number;

  @ApiProperty({
    title: 'Birthdate',
    required: false,
    type: 'string',
    example: '1991-10-14',
  })
  @IsOptional()
  @IsDate({
    message: validationMessages_EN.students.registerStudentDTO.birthdate.isDate,
  })
  birthdate: Date;

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

  @ApiProperty({
    title: 'Observations',
    required: false,
    type: 'string',
    example: 'The student is interested in music and anime.',
  })
  @IsOptional()
  @IsString({
    message:
      validationMessages_EN.students.registerStudentDTO.observations.isString,
  })
  observations?: string;
}
