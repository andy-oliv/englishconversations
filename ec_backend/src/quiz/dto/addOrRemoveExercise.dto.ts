import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class AddOrRemoveExerciseDTO {
  @ApiProperty({
    title: 'QuizID',
    required: true,
    type: 'string',
    example: '208af6ff-e969-408b-b7d2-0b12c847c29e',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.quizzes.addOrRemoveExerciseDTO.quizId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.quizzes.addOrRemoveExerciseDTO.quizId.isUUID,
  })
  quizId: string;

  @ApiProperty({
    title: 'ExerciseID',
    required: true,
    type: 'string',
    example: 2,
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.quizzes.addOrRemoveExerciseDTO.exerciseId
        .isNotEmpty,
  })
  @IsInt({
    message:
      validationMessages_EN.quizzes.addOrRemoveExerciseDTO.exerciseId.isInt,
  })
  exerciseId: number;
}
