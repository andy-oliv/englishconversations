import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { CEFRLevels, Difficulty } from '../../../generated/prisma';

export default class FetchByQueryDTO {
  @ApiProperty({
    title: 'Level',
    required: false,
    type: 'string',
    example: 'A1',
  })
  @IsOptional()
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1'], {
    message: validationMessages_EN.exercises.createExerciseDTO.level.isIn,
  })
  level: CEFRLevels;

  @ApiProperty({
    title: 'Difficulty',
    required: false,
    type: 'string',
    example: 'EASY',
  })
  @IsOptional()
  @IsIn(['EASY', 'MEDIUM', 'HARD'], {
    message: validationMessages_EN.exercises.createExerciseDTO.difficulty.isIn,
  })
  difficulty: Difficulty;

  @ApiProperty({
    title: 'QuizID',
    required: false,
    type: 'string',
    example: '3db18797-e514-40ac-9a2e-52927016476d',
  })
  @IsOptional()
  @IsUUID('all', {
    message:
      validationMessages_EN.exercises.fetchExercisesByQuery.quizId.isUUID,
  })
  quizId: string;
}
