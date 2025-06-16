import { IsInt, IsOptional, IsUUID } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class fetchAnswerByQuery {
  @ApiProperty({
    title: 'StudentID',
    required: false,
    type: 'string',
    example: 'f0aaa9ad-ee8e-42f0-a823-c90f2d255f5a',
  })
  @IsOptional()
  @IsUUID('all', {
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.studentId.isUUID,
  })
  studentId?: string;

  @ApiProperty({
    title: 'ExerciseID',
    required: false,
    type: 'number',
    example: 4,
  })
  @IsOptional()
  @IsInt({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.exerciseId.isInt,
  })
  exerciseId?: number;

  @ApiProperty({
    title: 'QuizId',
    required: false,
    type: 'string',
    example: 'f0aaa9ad-ee8e-42f0-a823-c90f2d255f5a',
  })
  @IsOptional()
  @IsUUID('all', {
    message: validationMessages_EN.answeredExercise.saveAnswerDTO.quizId.isUUID,
  })
  quizId?: string;
}
