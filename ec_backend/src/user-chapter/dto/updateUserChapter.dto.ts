import { IsDate, IsIn, IsNumber, IsOptional } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';
import { Status } from '@prisma/client';

export default class UpdateUserChapterDTO {
  @IsOptional()
  @IsIn(['LOCKED', 'IN_PROGRESS', 'COMPLETED'], {
    message: validationMessages_EN.userChapter.updateUserChapterDTO.status.isIn,
  })
  status?: Status;

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

  @IsOptional()
  @IsDate({
    message:
      validationMessages_EN.userChapter.updateUserChapterDTO.completedAt.isDate,
  })
  completedAt?: Date;
}
