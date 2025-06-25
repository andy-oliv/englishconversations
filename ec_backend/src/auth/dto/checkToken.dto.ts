import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class CheckTokenDTO {
  @ApiProperty({
    title: 'Token',
    required: true,
    type: 'string',
    example: '#hd)@jl4k019d0KKL',
  })
  @IsNotEmpty({
    message: validationMessages_EN.auth.checkTokenDTO.token.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.auth.checkTokenDTO.token.isString,
  })
  token: string;
}
