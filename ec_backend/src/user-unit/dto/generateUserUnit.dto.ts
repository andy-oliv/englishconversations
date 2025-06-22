import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class GenerateUserUnitDTO {
  @ApiProperty({
    title: 'UserID',
    required: true,
    type: 'string',
    example: '298b17e6-14e8-4224-8bab-3c4599a00a70',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.userUnit.generateUserUnitDTO.userId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.userUnit.generateUserUnitDTO.userId.isUUID,
  })
  userId: string;

  @ApiProperty({
    title: 'UnitID',
    required: true,
    type: 'number',
    example: 1,
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.userUnit.generateUserUnitDTO.unitId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.userUnit.generateUserUnitDTO.unitId.isInt,
  })
  unitId: number;
}
