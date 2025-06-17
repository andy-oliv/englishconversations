import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { CEFRLevels, Difficulty } from '../../../generated/prisma';

export default class UpdateQuizDTO {
  @ApiProperty({
    title: 'IsTest',
    required: false,
    type: 'boolean',
    example: 'false',
  })
  @IsOptional()
  @IsBoolean({
    message: validationMessages_EN.quizzes.createQuizDTO.isTest.isBoolean,
  })
  isTest?: boolean;

  @ApiProperty({
    title: 'Title',
    required: false,
    type: 'string',
    example: 'Placement test',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.quizzes.createQuizDTO.title.isString,
  })
  title?: string;

  @ApiProperty({
    title: 'Description',
    required: false,
    type: 'string',
    example: 'Test to check the student level.',
  })
  @IsOptional()
  @IsString({
    message: validationMessages_EN.quizzes.createQuizDTO.description.isString,
  })
  description?: string;

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
    required: false,
    type: 'string',
    example: 'MEDIUM',
  })
  @IsOptional()
  @IsIn(['EASY', 'MEDIUM', 'HARD'], {
    message: validationMessages_EN.quizzes.createQuizDTO.difficulty.isIn,
  })
  difficulty?: Difficulty;

  @ApiProperty({
    title: 'UnitID',
    required: false,
    type: 'string',
    example: 5,
  })
  unitId?: number;
}
