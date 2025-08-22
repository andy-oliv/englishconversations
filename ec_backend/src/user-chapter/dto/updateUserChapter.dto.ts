import { IsNumber, IsOptional } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class UpdateUserChapterDTO {
  @IsOptional()
  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 2 },
    {
      message:
        validationMessages_EN.userChapter.updateUserChapterDTO.progress
          .isNumber,
    },
  )
  progress?: number;
}
