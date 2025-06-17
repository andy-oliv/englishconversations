import { IsIn, IsInt, IsNotEmpty, IsUUID, ValidateIf } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ContentType } from '../../common/types/ContentType';
import { ApiProperty } from '@nestjs/swagger';

export default class AddOrRemoveTagDTO {
  @ApiProperty({
    title: 'ContentType',
    required: true,
    type: 'string',
    example: 'exercise',
  })
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.contentType.isNotEmpty,
  })
  @IsIn(['exercise', 'quiz', 'unit', 'video'], {
    message: validationMessages_EN.tag.addOrRemoveTagDTO.contentType.isIn,
  })
  contentType: ContentType;

  @ApiProperty({
    title: 'TagId',
    required: true,
    type: 'number',
    example: 1,
  })
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.tagId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.tagId.isInt,
  })
  tagId: number;

  @ApiProperty({
    title: 'ExerciseID',
    required: false,
    type: 'number',
    example: 2,
  })
  @ValidateIf((request) => request.contentType.toLowerCase() === 'exercise')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.exerciseId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.exerciseId.isInt,
  })
  exerciseId?: number;

  @ApiProperty({
    title: 'QuizID',
    required: false,
    type: 'string',
    example: '8ff86be5-5b94-4b73-865f-105b08d1d4f6',
  })
  @ValidateIf((request) => request.contentType.toLowerCase() === 'quiz')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.quizId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.tag.addOrRemoveTagDTO.quizId.isUUID,
  })
  quizId?: string;

  @ApiProperty({
    title: 'UnitID',
    required: false,
    type: 'number',
    example: 4,
  })
  @ValidateIf((request) => request.contentType.toLowerCase() === 'unit')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.unitId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.unitId.isInt,
  })
  unitId?: number;

  @ApiProperty({
    title: 'videoID',
    required: false,
    type: 'string',
    example: '8ff86be5-5b94-4b73-865f-105b08d1d4f6',
  })
  @ValidateIf((request) => request.contentType.toLowerCase() === 'video')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.videoId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.tag.addOrRemoveTagDTO.videoId.isUUID,
  })
  videoId?: string;
}
