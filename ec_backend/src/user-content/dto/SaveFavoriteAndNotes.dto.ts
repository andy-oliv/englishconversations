import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import validationMessages_EN from 'src/helper/messages/validationMessages.en';

export default class saveFavoriteAndNotesDTO {
  @ApiProperty({
    title: 'isFavorite',
    required: false,
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsBoolean({
    message:
      validationMessages_EN.userContent.updateUserContentDTO.isFavorite
        .isBoolean,
  })
  isFavorite?: boolean;

  @ApiProperty({
    title: 'Notes',
    required: false,
    type: 'string',
    example: 'my notes',
  })
  @IsOptional()
  @IsString({
    message:
      validationMessages_EN.userContent.updateUserContentDTO.notes.isString,
  })
  notes?: string;
}
