import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import httpMessages_EN from '../messages/httpMessages.en';

export default function allowedTypes(file: Express.Multer.File): void {
  const allowedTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
  ];

  try {
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(httpMessages_EN.helper.status_4004);
    }
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }

    throw new InternalServerErrorException(httpMessages_EN.general.status_500);
  }
}
