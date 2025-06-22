import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class LoginDTO {
  @ApiProperty({
    title: 'Email',
    required: true,
    type: 'string',
    example: 'john.doe@mail.com',
  })
  @IsNotEmpty({
    message: validationMessages_EN.auth.loginDTO.email.isNotEmpty,
  })
  @IsEmail(
    {},
    {
      message: validationMessages_EN.auth.loginDTO.email.isEmail,
    },
  )
  email: string;

  @ApiProperty({
    title: 'IsTest',
    required: true,
    type: 'string',
    example: '#i8NNhl10@%',
  })
  @IsNotEmpty({
    message: validationMessages_EN.auth.loginDTO.password.isNotEmpty,
  })
  @IsStrongPassword(
    { minLength: 8 },
    {
      message: validationMessages_EN.auth.loginDTO.password.isStrongPassword,
    },
  )
  password: string;
}
