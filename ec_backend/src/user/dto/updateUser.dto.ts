import { IsDate, IsOptional, IsString, IsUrl } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateUserDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.user.updateUserDTO.name.isString,
  })
  name?: string;

  @ApiProperty({
    title: 'Bio',
    required: false,
    type: 'string',
    example: "I'm an engineer trying to learn English.",
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.user.updateUserDTO.bio.isString,
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
    message: validationMessages_EN.user.updateUserDTO.birthdate.isDate,
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
    message: validationMessages_EN.user.updateUserDTO.city.isString,
  })
  city?: string;

  @ApiProperty({
    title: 'State',
    required: false,
    type: 'string',
    example: 'Rio Grande do Sul',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.user.updateUserDTO.state.isString,
  })
  state?: string;

  @ApiProperty({
    title: 'Country',
    required: false,
    type: 'string',
    example: 'Brazil',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.user.updateUserDTO.country.isString,
  })
  country?: string;

  @ApiProperty({
    title: 'AvatarURL',
    required: false,
    type: 'string',
    example: 'https://google.com',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message: validationMessages_EN.user.updateUserDTO.avatarUrl.isUrl,
    },
  )
  avatarUrl?: string;
}
