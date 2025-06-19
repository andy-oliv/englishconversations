import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class FetchUserByEmailDTO {
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
}
