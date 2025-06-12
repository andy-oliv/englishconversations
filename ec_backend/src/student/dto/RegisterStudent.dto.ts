import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class RegisterStudentDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'John Doe',
  })
  @IsNotEmpty({
    message: validationMessages_EN.students.registerStudentDTO.name.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.students.registerStudentDTO.name.isString,
  })
  name: string;

  @ApiProperty({
    title: 'Age',
    required: true,
    type: 'number',
    example: 33,
  })
  @IsNotEmpty({
    message: validationMessages_EN.students.registerStudentDTO.age.isNotEmpty,
  })
  @IsNumber(
    {},
    { message: validationMessages_EN.students.registerStudentDTO.age.isNumber },
  )
  age: number;

  @ApiProperty({
    title: 'Birthdate',
    required: true,
    type: 'string',
    example: '1991-10-14',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.students.registerStudentDTO.birthdate.isNotEmpty,
  })
  @IsDate({
    message: validationMessages_EN.students.registerStudentDTO.birthdate.isDate,
  })
  birthdate: Date;

  @ApiProperty({
    title: 'City',
    required: true,
    type: 'string',
    example: 'São Paulo',
  })
  @IsNotEmpty({
    message: validationMessages_EN.students.registerStudentDTO.city.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.students.registerStudentDTO.city.isString,
  })
  city: string;

  @ApiProperty({
    title: 'State',
    required: true,
    type: 'string',
    example: 'São Paulo',
  })
  @IsNotEmpty({
    message: validationMessages_EN.students.registerStudentDTO.state.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.students.registerStudentDTO.state.isString,
  })
  state: string;

  @ApiProperty({
    title: 'Country',
    required: true,
    type: 'string',
    example: 'Brasil',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.students.registerStudentDTO.country.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.students.registerStudentDTO.country.isString,
  })
  country: string;
}
