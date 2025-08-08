import { IsBoolean, IsDate, IsIn, IsNumber, IsOptional } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export default class UpdateUserUnitDTO {
  @ApiProperty({
    title: 'Status',
    required: false,
    type: 'string',
    example: 'LOCKED',
  })
  @IsOptional()
  @IsIn(['LOCKED', 'IN_PROGRESS', 'COMPLETED'], {
    message: validationMessages_EN.userUnit.updateUserUnitDTO.status.isIn,
  })
  status?: Status;

  @ApiProperty({
    title: 'Progress',
    required: false,
    type: 'number',
    example: 0.5,
  })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 2 },
    {
      message:
        validationMessages_EN.userUnit.updateUserUnitDTO.progress.isNumber,
    },
  )
  progress?: number;

  @ApiProperty({
    title: 'CompletedAt',
    required: false,
    type: 'string',
    example: '2025-10-21',
  })
  @IsOptional()
  @IsDate({
    message:
      validationMessages_EN.userUnit.updateUserUnitDTO.completedAt.isDate,
  })
  completedAt?: Date;
}
