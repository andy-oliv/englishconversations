import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class AddTagDTO {
  @IsNotEmpty({
    message: validationMessages_EN.tag.addTagDTO.contentType.isNotEmpty,
  })
  @IsIn(['exercise', 'quiz', 'unit'], {
    message: validationMessages_EN.tag.addTagDTO.contentType.isIn,
  })
  contentType: string;

  @IsNotEmpty({
    message: validationMessages_EN.tag.addTagDTO.tagId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.tag.addTagDTO.tagId.isInt,
  })
  tagId: number;

  @ValidateIf((object) => object.contentType.toLowerCase() === 'exercise')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addTagDTO.exerciseId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.tag.addTagDTO.exerciseId.isInt,
  })
  exerciseId?: number;

  @ValidateIf((object) => object.contentType.toLowerCase() === 'quiz')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addTagDTO.quizId.isNotEmpty,
  })
  @IsUUID('all', {
    message: validationMessages_EN.tag.addTagDTO.quizId.isUUID,
  })
  quizId?: string;

  @ValidateIf((object) => object.contentType.toLowerCase() === 'unit')
  @IsNotEmpty({
    message: validationMessages_EN.tag.addTagDTO.unitId.isNotEmpty,
  })
  @IsInt({
    message: validationMessages_EN.tag.addTagDTO.unitId.isInt,
  })
  unitId?: number;
}
