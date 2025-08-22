import { IsNumber, IsOptional } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateUserUnitDTO {
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
}
