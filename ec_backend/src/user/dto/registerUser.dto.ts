import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class RegisterUserDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'John Doe',
  })
  @IsNotEmpty({
    message: validationMessages_EN.user.registerUserDTO.name.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.user.registerUserDTO.name.isString,
  })
  name: string;

  @ApiProperty({
    title: 'Bio',
    required: false,
    type: 'string',
    example: "I'm an engineer trying to learn English.",
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.user.registerUserDTO.bio.isString,
  })
  bio?: string;

  @ApiProperty({
    title: 'Birthdate',
    required: false,
    type: 'string',
    example: '1991-07-10',
  })
  @IsOptional()
  @IsDate({
    message: validationMessages_EN.user.registerUserDTO.birthdate.isDate,
  })
  birthdate: Date;

  @ApiProperty({
    title: 'City',
    required: false,
    type: 'string',
    example: 'Porto Alegre',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.user.registerUserDTO.city.isString,
  })
  city?: string;

  @ApiProperty({
    title: 'State',
    required: false,
    type: 'string',
    example: 'RS',
  })
  @IsOptional()
  @IsIn(
    [
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ],
    {
      message: validationMessages_EN.user.registerUserDTO.state.isIn,
    },
  )
  state?: string;

  @ApiProperty({
    title: 'Country',
    required: false,
    type: 'string',
    example: 'Brazil',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.user.registerUserDTO.country.isString,
  })
  country?: string;

  @ApiProperty({
    title: 'Email',
    required: true,
    type: 'string',
    example: 'john.doe@mail.com',
  })
  @IsNotEmpty({
    message: validationMessages_EN.user.registerUserDTO.email.isNotEmpty,
  })
  @IsEmail(
    {},
    {
      message: validationMessages_EN.user.registerUserDTO.email.isEmail,
    },
  )
  email: string;

  @ApiProperty({
    title: 'Password',
    required: true,
    type: 'string',
    example: 'Im4*Sljdm.8&&#',
  })
  @IsNotEmpty({
    message: validationMessages_EN.user.registerUserDTO.password.isNotEmpty,
  })
  @IsStrongPassword(
    {
      minLength: 8,
    },
    {
      message:
        validationMessages_EN.user.registerUserDTO.password.isStrongPassword,
    },
  )
  password: string;
}
