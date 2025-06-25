import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class updatePasswordDTO {
  @ApiProperty({
    title: 'Email',
    required: true,
    type: 'string',
    example: 'john.doe@mail.com',
  })
  @IsNotEmpty({
    message: validationMessages_EN.auth.updatePasswordDTO.email.isNotEmpty,
  })
  @IsEmail(
    {},
    {
      message: validationMessages_EN.auth.updatePasswordDTO.email.isEmail,
    },
  )
  email: string;

  @ApiProperty({
    title: 'Password',
    required: true,
    type: 'string',
    example: 'Em85*&kl31rD',
  })
  @IsNotEmpty({
    message: validationMessages_EN.auth.updatePasswordDTO.password.isNotEmpty,
  })
  @IsStrongPassword(
    {
      minLength: 8,
    },
    {
      message:
        validationMessages_EN.auth.updatePasswordDTO.password.isStrongPassword,
    },
  )
  password: string;
}
