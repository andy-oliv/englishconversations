import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  CEFRLevels,
  Difficulty,
  ExerciseTypes,
  Prisma,
} from '../../../generated/prisma';
import { ApiProperty } from '@nestjs/swagger';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class CreateExerciseDTO {
  @ApiProperty({
    title: 'Type',
    required: true,
    type: 'string',
    example: 'FILL_IN_THE_BLANKS',
  })
  @IsNotEmpty({
    message: validationMessages_EN.exercises.createExerciseDTO.type.isNotEmpty,
  })
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
  type: ExerciseTypes;

  @ApiProperty({
    title: 'Description',
    required: true,
    type: 'string',
    example: 'Where _____ my pencils?',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.exercises.createExerciseDTO.description.isNotEmpty,
  })
  @IsString({
    message:
      validationMessages_EN.exercises.createExerciseDTO.description.isString,
  })
  description: string;

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
    required: true,
    type: 'string',
    example: 'A1',
  })
  @IsNotEmpty({
    message: validationMessages_EN.exercises.createExerciseDTO.level.isNotEmpty,
  })
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1'], {
    message: validationMessages_EN.exercises.createExerciseDTO.level.isIn,
  })
  level: CEFRLevels;

  @ApiProperty({
    title: 'Difficulty',
    required: true,
    type: 'string',
    example: 'EASY',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.exercises.createExerciseDTO.difficulty.isNotEmpty,
  })
  @IsIn(['EASY', 'MEDIUM', 'HARD'], {
    message: validationMessages_EN.exercises.createExerciseDTO.difficulty.isIn,
  })
  difficulty: Difficulty;

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
    required: true,
    type: 'string',
    example: 'are',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.exercises.createExerciseDTO.correctAnswer
        .isNotEmpty,
  })
  @IsArray({
    message:
      validationMessages_EN.exercises.createExerciseDTO.correctAnswer.isArray,
  })
  correctAnswer: Prisma.JsonValue;
}
