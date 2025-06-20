import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class GenerateUserChapterDTO {
  @ApiProperty({
    title: 'UserID',
    required: true,
    type: 'string',
    example: 'd664a811-8dd1-4059-995a-3a01cba282a9',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.userChapter.generateUserChapterDTO.userId
        .isNotEmpty,
  })
  @IsUUID('all', {
    message:
      validationMessages_EN.userChapter.generateUserChapterDTO.userId.isUUID,
  })
  userId: string;

  @ApiProperty({
    title: 'ChapterID',
    required: true,
    type: 'string',
    example: 'd664a811-8dd1-4059-995a-3a01cba282a9',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.userChapter.generateUserChapterDTO.chapterId
        .isNotEmpty,
  })
  @IsUUID('all', {
    message:
      validationMessages_EN.userChapter.generateUserChapterDTO.chapterId.isUUID,
  })
  chapterId: string;
}
