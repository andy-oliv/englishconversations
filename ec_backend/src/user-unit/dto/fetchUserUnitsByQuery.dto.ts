import { IsIn, IsInt, IsOptional, IsUUID } from 'class-validator';
import { Status } from '../../../generated/prisma';
import { ApiProperty } from '@nestjs/swagger';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { Transform } from 'class-transformer';

export default class FetchUserUnitsByQueryDTO {
  @ApiProperty({
    title: 'UserID',
    required: false,
    type: 'string',
    example: '298b17e6-14e8-4224-8bab-3c4599a00a70',
  })
  @IsOptional()
  @IsUUID('all', {
    message:
      validationMessages_EN.userUnit.fetchUserUnitsByQueryDTO.userId.isUUID,
  })
  userId: string;

  @ApiProperty({
    title: 'UnitID',
    required: false,
    type: 'number',
    example: 1,
  })
  @IsOptional()
  @IsInt({
    message:
      validationMessages_EN.userUnit.fetchUserUnitsByQueryDTO.unitId.isInt,
  })
  unitId: number;

  @ApiProperty({
    title: 'Status',
    required: false,
    type: 'string',
    example: 'LOCKED',
  })
  @IsOptional()
  @IsIn(['LOCKED', 'IN_PROGRESS', 'COMPLETED'], {
    message:
      validationMessages_EN.userUnit.fetchUserUnitsByQueryDTO.status.isIn,
  })
  status: Status;
}
