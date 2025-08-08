import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class GenerateProgressDTO {
  @ApiProperty({
    title: 'UserID',
    required: true,
    type: 'string',
    example: '393951a9-c419-489d-a25f-356db40e3b08',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.slideshowProgress.generateProgressDTO.userId
        .isNotEmpty,
  })
  @IsUUID('all', {
    message:
      validationMessages_EN.slideshowProgress.generateProgressDTO.userId.isUUID,
  })
  userId: string;

  @ApiProperty({
    title: 'SlideID',
    required: true,
    type: 'string',
    example: '393951a9-c419-489d-a25f-356db40e3b08',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.slideshowProgress.generateProgressDTO.slideshowId
        .isNotEmpty,
  })
  @IsUUID('all', {
    message:
      validationMessages_EN.slideshowProgress.generateProgressDTO.slideshowId
        .isUUID,
  })
  slideshowId: string;

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
