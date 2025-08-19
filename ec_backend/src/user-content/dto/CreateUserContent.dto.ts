import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import validationMessages_EN from 'src/helper/messages/validationMessages.en';

export default class CreateUserContentDTO {
  @ApiProperty({
    title: 'UserID',
    required: true,
    type: 'string',
    example: 'a03427d5-a08f-4f32-b33f-1fd4f59b9cb8',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.userContent.createUserContentDTO.userId.isNotEmpty,
  })
  @IsUUID('all', {
    message:
      validationMessages_EN.userContent.createUserContentDTO.userId.isUUID,
  })
  userId: string;

  @ApiProperty({
    title: 'ContentID',
    required: true,
    type: 'number',
    example: 2,
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.userContent.createUserContentDTO.contentId
        .isNotEmpty,
  })
  @IsInt({
    message:
      validationMessages_EN.userContent.createUserContentDTO.contentId.isInt,
  })
  contentId: number;

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
