import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileTypes } from '../../../generated/prisma';
import httpMessages_EN from '../messages/httpMessages.en';

export default function defineFileType(mimetype: string): FileTypes {
  if (mimetype === 'application/pdf') {
    return 'PDF';
  }

  try {
    const types: Record<string, FileTypes> = {
      audio: 'AUDIO',
      image: 'IMAGE',
    };
    const category: string = mimetype.split('/')[0];
    const fileType: FileTypes = types[category];

    if (!fileType) {
      throw new BadRequestException('Unsupported mimetype: ${mimetype}');
    }

    return fileType;
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw BadRequestException;
    }

    throw new InternalServerErrorException(httpMessages_EN.general.status_500);
  }
}
