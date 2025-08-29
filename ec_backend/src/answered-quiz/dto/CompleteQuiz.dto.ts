import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import QuizAnswer from '../../common/types/QuizAnswer';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class CompleteQuizDTO {
  @IsNotEmpty({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.quizId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.answeredQuiz.completeQuizDTO.quizId.isUUID,
  })
  quizId: string;

  @IsNotEmpty({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.userId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.answeredQuiz.completeQuizDTO.userId.isUUID,
  })
  userId: string;

  @IsNotEmpty({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.score.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.answeredQuiz.completeQuizDTO.score.isInt,
  })
  score: number;

  @IsNotEmpty({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.elapsedTime.isNotEmpty,
  })
  @IsInt({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.elapsedTime.isInt,
  })
  elapsedTime: number;

  @IsNotEmpty({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.userContentId
        .isNotEmpty,
  })
  @IsInt({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.userContentId.isInt,
  })
  userContentId: number;

  @IsNotEmpty({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.answers.isNotEmpty,
  })
  @IsArray({
    message: validationMessages_EN.answeredQuiz.completeQuizDTO.answers.isArray,
  })
  answers: QuizAnswer[];

  @IsOptional()
  @IsBoolean({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.isTest.isBoolean,
  })
  isTest?: boolean;

  @IsNotEmpty({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.isPassed.isNotEmpty,
  })
  @IsBoolean({
    message:
      validationMessages_EN.answeredQuiz.completeQuizDTO.isPassed.isBoolean,
  })
  isPassed: boolean;
}
