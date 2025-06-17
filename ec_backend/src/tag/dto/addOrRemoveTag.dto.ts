import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class AddOrRemoveTagDTO {
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.contentType.isNotEmpty,
  })
  @IsIn(['exercise', 'quiz', 'unit', 'video'], {
    message: validationMessages_EN.tag.addOrRemoveTagDTO.contentType.isIn,
  })
  contentType: string;

  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.tagId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.tagId.isInt,
  })
  tagId: number;

  @ValidateIf((request) => request.contentType.toLowerCase() === 'exercise')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.exerciseId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.exerciseId.isInt,
  })
  exerciseId?: number;

  @ValidateIf((request) => request.contentType.toLowerCase() === 'quiz')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.quizId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.tag.addOrRemoveTagDTO.quizId.isUUID,
  })
  quizId?: string;

  @ValidateIf((request) => request.contentType.toLowerCase() === 'unit')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.unitId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.unitId.isInt,
  })
  unitId?: number;

  @ValidateIf((request) => request.contentType.toLowerCase() === 'unit')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.videoId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.tag.addOrRemoveTagDTO.videoId.isUUID,
  })
  videoId?: string;
}
