import { ApiProperty } from '@nestjs/swagger';
import { CEFRLevels, Difficulty } from '../../../generated/prisma';
import { IsIn, IsOptional } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class fetchQuizzesByQueryDTO {
  @ApiProperty({
    title: 'Level',
    required: false,
    type: 'string',
    example: 'A1',
  })
  @IsOptional()
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1'], {
    message: validationMessages_EN.quizzes.fetchQuizzesByQueryDTO.level.isIn,
  })
  level?: CEFRLevels;

  @ApiProperty({
    title: 'Difficulty',
    required: false,
    type: 'string',
    example: 'MEDIUM',
  })
  @IsOptional()
  @IsIn(['EASY', 'MEDIUM', 'HARD'], {
    message:
      validationMessages_EN.quizzes.fetchQuizzesByQueryDTO.difficulty.isIn,
  })
  difficulty?: Difficulty;
}
