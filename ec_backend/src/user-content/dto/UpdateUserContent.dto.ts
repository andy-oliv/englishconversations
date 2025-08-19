import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';
import validationMessages_EN from 'src/helper/messages/validationMessages.en';

export default class UpdateUserContentDTO {
  @ApiProperty({
    title: 'Status',
    required: false,
    type: 'string',
    example: 'LOCKED',
  })
  @IsOptional()
  @IsIn(['LOCKED', 'IN_PROGRESS', 'COMPLETED'], {
    message: validationMessages_EN.userContent.createUserContentDTO.status.isIn,
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
    { allowNaN: false },
    {
      message:
        validationMessages_EN.userContent.createUserContentDTO.progress
          .isNumber,
    },
  )
  progress?: number;
}
