import { ApiProperty } from '@nestjs/swagger';
import { CEFRLevels, Difficulty } from '@prisma/client';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class CreateQuizDTO {
  @ApiProperty({
    title: 'IsTest',
    required: false,
    type: 'boolean',
    example: 'true',
  })
  @IsOptional()
  @IsBoolean({
    message: validationMessages_EN.quizzes.createQuizDTO.isTest.isBoolean,
  })
  isTest?: boolean;

  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'Placement test',
  })
  @IsNotEmpty({
    message: validationMessages_EN.quizzes.createQuizDTO.title.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.quizzes.createQuizDTO.title.isString,
  })
  title: string;

  @ApiProperty({
    title: 'Description',
    required: true,
    type: 'string',
    example: 'Test to check the student level.',
  })
  @IsNotEmpty({
    message: validationMessages_EN.quizzes.createQuizDTO.description.isNotEmpty,
  })
  @IsString({
    message: validationMessages_EN.quizzes.createQuizDTO.description.isString,
  })
  description: string;

  @ApiProperty({
    title: 'FileID',
    required: false,
    type: 'string',
    example: 'http://google.com/images/114kfafiP',
  })
  @IsOptional()
  @IsUrl(
    {},
    { message: validationMessages_EN.quizzes.createQuizDTO.fileId.isUrl },
  )
  fileId?: string;

  @ApiProperty({
    title: 'Level',
    required: false,
    type: 'string',
    example: 'A1',
  })
  @IsOptional()
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1'], {
    message: validationMessages_EN.quizzes.createQuizDTO.level.isIn,
  })
  level?: CEFRLevels;

  @ApiProperty({
    title: 'Difficulty',
    required: true,
    type: 'string',
    example: 'MEDIUM',
  })
  @IsNotEmpty({
    message: validationMessages_EN.quizzes.createQuizDTO.difficulty.isNotEmpty,
  })
  @IsIn(['EASY', 'MEDIUM', 'HARD'], {
    message: validationMessages_EN.quizzes.createQuizDTO.difficulty.isIn,
  })
  difficulty: Difficulty;

  @ApiProperty({
    title: 'UnitID',
    required: false,
    type: 'string',
    example: 5,
  })
  unitId?: number;
}
