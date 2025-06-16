import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class SaveQuizAnswerDTO {
  @ApiProperty({
    title: 'QuizID',
    required: true,
    type: 'string',
    example: 'f0aaa9ad-ee8e-42f0-a823-c90f2d255f5a',
  })
  @IsNotEmpty({ message: validationMessages_EN.answeredQuiz.quizId.isNotEmpty })
  @IsUUID('all', {
    message: validationMessages_EN.answeredQuiz.quizId.isUUID,
  })
  quizId: string;

  @ApiProperty({
    title: 'StudentID',
    required: true,
    type: 'string',
    example: 'f0aaa9ad-ee8e-42f0-a823-c90f2d255f5a',
  })
  @IsNotEmpty({
    message: validationMessages_EN.answeredQuiz.studentId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.answeredQuiz.studentId.isUUID,
  })
  studentId: string;

  @ApiProperty({
    title: 'Score',
    required: true,
    type: 'number',
    example: 10,
  })
  @IsNotEmpty({ message: validationMessages_EN.answeredQuiz.score.isNotEmpty })
  @IsInt({
    message: validationMessages_EN.answeredQuiz.score.isInt,
  })
  score: number;

  @ApiProperty({
    title: 'Feedback',
    required: false,
    type: 'string',
    example: 'Congrats!',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.answeredQuiz.feedback.isString,
  })
  feedback?: string;

  @ApiProperty({
    title: 'ElapsedTime',
    required: true,
    type: 'number',
    example: 15000,
  })
  @IsNotEmpty({
    message: validationMessages_EN.answeredQuiz.elapsedTime.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.answeredQuiz.elapsedTime.isInt,
  })
  elapsedTime: number;

  @ApiProperty({
    title: 'IsRetry',
    required: false,
    type: 'boolean',
    example: false,
  })
  @IsOptional()
  @IsBoolean({
    message: validationMessages_EN.answeredQuiz.isRetry.isBoolean,
  })
  isRetry?: boolean;
}
