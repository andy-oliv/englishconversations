import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '../../../generated/prisma';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class SaveAnswerDTO {
  @ApiProperty({
    title: 'ExerciseID',
    required: true,
    type: 'number',
    example: 1,
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.exerciseId
        .isNotEmpty,
  })
  @IsInt({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.exerciseId.isInt,
  })
  exerciseId: number;

  @ApiProperty({
    title: 'UserID',
    required: true,
    type: 'string',
    example: 'fa7f094c-be3a-4c1f-9369-957f7d91d05b',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.userId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.answeredExercise.saveAnswerDTO.userId.isUUID,
  })
  userId: string;

  @ApiProperty({
    title: 'AnsweredQuizID',
    required: false,
    type: 'string',
    example: 'fa7f094c-be3a-4c1f-9369-957f7d91d05b',
  })
  @IsOptional()
  @IsUUID('all', {
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.answeredQuizId
        .isUUID,
  })
  answeredQuizId?: string;

  @ApiProperty({
    title: 'IsRetry',
    required: false,
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsBoolean({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.isRetry.isBoolean,
  })
  isRetry?: boolean;

  @ApiProperty({
    title: 'selectedAnswers',
    required: false,
    type: 'array',
    example: ['are', 'am'],
  })
  @IsOptional()
  @IsArray({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.selectedAnswers
        .isArray,
  })
  selectedAnswers?: Prisma.JsonValue;

  @ApiProperty({
    title: 'TextAnswer',
    required: false,
    type: 'string',
    example: 'jump',
  })
  @IsOptional()
  @IsString({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.textAnswer.isString,
  })
  textAnswer?: string;

  @ApiProperty({
    title: 'FileId',
    required: false,
    type: 'string',
    example: 'http://google.com/audio/1401f0SIx',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message:
        validationMessages_EN.answeredExercise.saveAnswerDTO.fileId.isUrl,
    },
  )
  fileId?: string;

  @ApiProperty({
    title: 'IsCorrectAnswer',
    required: false,
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsBoolean({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.isCorrectAnswer
        .isBoolean,
  })
  isCorrectAnswer?: boolean;

  @ApiProperty({
    title: 'Feedback',
    required: false,
    type: 'string',
    example: 'Great job!',
  })
  @IsOptional()
  @IsString({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.feedback.isString,
  })
  feedback?: string;

  @ApiProperty({
    title: 'ElapsedTime',
    required: true,
    type: 'number',
    description: 'time in seconds',
    example: 120,
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.elapsedTime
        .isNotEmpty,
  })
  @IsInt({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.elapsedTime.isInt,
  })
  elapsedTime: number;
}
