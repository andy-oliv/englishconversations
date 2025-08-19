import { IsIn, IsInt, IsNumber, IsOptional } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

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

  @ApiProperty({
    title: 'UserContentId',
    required: true,
    type: 'number',
    example: 2,
  })
  @IsOptional()
  @IsInt({
    message:
      validationMessages_EN.slideshowProgress.generateProgressDTO.userContentId
        .isInt,
  })
  userContentId: number;
}
