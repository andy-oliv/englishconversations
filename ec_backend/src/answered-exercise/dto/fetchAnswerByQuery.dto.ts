import { IsInt, IsOptional, IsUUID } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class fetchAnswerByQuery {
  @IsOptional()
  @IsUUID('all', {
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.studentId.isUUID,
  })
  studentId?: string;

  @IsOptional()
  @IsInt({
    message:
      validationMessages_EN.answeredExercise.saveAnswerDTO.exerciseId.isInt,
  })
  exerciseId?: number;

  @IsOptional()
  @IsUUID('all', {
    message: validationMessages_EN.answeredExercise.saveAnswerDTO.quizId.isUUID,
  })
  quizId?: string;
}
