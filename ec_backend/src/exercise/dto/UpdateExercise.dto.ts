import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { CEFRLevels, Difficulty, ExerciseTypes, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class UpdateExerciseDTO {
  @ApiProperty({
    title: 'Type',
    required: false,
    type: 'string',
    example: 'FILL_IN_THE_BLANKS',
  })
  @IsOptional()
  @IsIn(
    [
      'FILL_IN_THE_BLANKS',
      'MULTIPLE_CHOICE_QUESTION',
      'CORRECT_OR_INCORRECT',
      'MATCH_THE_COLUMNS',
      'UNSCRAMBLE_WORD',
      'UNSCRAMBLE_SENTENCE',
      'LISTENING_COMPREHENSION',
      'PICTIONARY',
      'FREE_ANSWER_QUESTION',
      'TRANSLATION',
      'SPEAKING_EXERCISE',
      'VIDEO_QUESTION',
    ],
    {
      message: validationMessages_EN.exercises.createExerciseDTO.type.isIn,
    },
  )
  type?: ExerciseTypes;

  @ApiProperty({
    title: 'Description',
    required: false,
    type: 'string',
    example: 'Where _____ my pencils?',
  })
  @IsOptional()
  @IsString({
    message:
      validationMessages_EN.exercises.createExerciseDTO.description.isString,
  })
  description?: string;

  @ApiProperty({
    title: 'ContentUrl',
    required: false,
    type: 'string',
    example: 'https://google.com',
  })
  @IsOptional()
  @IsUrl(
    {},
    {
      message:
        validationMessages_EN.exercises.createExerciseDTO.contentUrl.isUrl,
    },
  )
  contentUrl?: string;

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
  level?: CEFRLevels;

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
  difficulty?: Difficulty;

  @ApiProperty({
    title: 'Options',
    required: false,
    type: 'array',
    example: '["are", "is", "am", "was"]',
  })
  @IsOptional()
  @IsArray({
    message: validationMessages_EN.exercises.createExerciseDTO.options.isArray,
  })
  options?: Prisma.JsonValue;

  @ApiProperty({
    title: 'CorrectAnswer',
    required: false,
    type: 'string',
    example: 'are',
  })
  @IsOptional()
  @IsArray({
    message:
      validationMessages_EN.exercises.createExerciseDTO.correctAnswer.isArray,
  })
  correctAnswer?: Prisma.JsonValue;

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
  quizId?: string;
}
