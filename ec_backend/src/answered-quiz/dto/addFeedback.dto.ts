import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class AddFeedbackDTO {
  @ApiProperty({
    title: 'Feedback',
    required: true,
    type: 'string',
    example: 'Congrats!',
  })
  @IsNotEmpty({
    message: validationMessages_EN.answeredQuiz.addFeedback.feedback.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.answeredQuiz.addFeedback.feedback.isString,
  })
  feedback: string;
}
