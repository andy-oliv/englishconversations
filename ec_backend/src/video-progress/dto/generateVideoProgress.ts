import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import validationMessages_EN from '../../helper/messages/validationMessages.en';

export default class GenerateVideoProgressDTO {
  @ApiProperty({
    title: 'UserID',
    required: true,
    type: 'string',
    example: '35ba4515-4ece-43f3-bb55-8a632aaaa873',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.userId
        .isNotEmpty,
  })
  @IsUUID('all', {
    message:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.userId
        .isUUID,
  })
  userId: string;

  @ApiProperty({
    title: 'VideoID',
    required: true,
    type: 'string',
    example: '47d96219-e87a-4089-8718-93b469eeb40b',
  })
  @IsNotEmpty({
    message:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.videoId
        .isNotEmpty,
  })
  @IsUUID('all', {
    message:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.videoId
        .isUUID,
  })
  videoId: string;
}
