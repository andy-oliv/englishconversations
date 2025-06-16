import { IsNotEmpty, IsString } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateFeedbackDTO {
  @ApiProperty({
    title: 'Feedback',
    required: true,
    type: 'string',
    example: 'Great job!',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.answeredExercise.addFeedback.feedback.isNotEmpty,
  })
  @IsString({
    message:
      validationMessages_EN.answeredExercise.addFeedback.feedback.isString,
  })
  feedback?: string;
}
