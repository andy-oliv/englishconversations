import { IsIn, IsNumber, IsOptional } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../../generated/prisma';

export default class UpdateProgressDTO {
  @ApiProperty({
    title: 'Status',
    required: false,
    type: 'string',
    example: 'LOCKED',
  })
  @IsOptional()
  @IsIn(['LOCKED', 'IN_PROGRESS', 'COMPLETED'], {
    message:
      validationMessages_EN.slideshowProgress.generateProgressDTO.status.isIn,
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
    {},
    {
      message:
        validationMessages_EN.slideshowProgress.generateProgressDTO.progress
          .isNumber,
    },
  )
  progress?: number;
}
