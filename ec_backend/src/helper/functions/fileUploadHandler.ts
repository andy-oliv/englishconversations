import { validate } from 'class-validator';
import GenerateFileDTO from '../../file/dto/generateFile.dto';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { S3Service } from '../../s3/s3.service';
import handleInternalErrorException from './handleErrorException';
import loggerMessages from '../messages/loggerMessages';
import { Logger } from 'nestjs-pino';
import httpMessages_EN from '../messages/httpMessages.en';

export default async function fileUploadHandler(
  file: Express.Multer.File,
  metadata: string,
  s3Service: S3Service,
  logger: Logger,
): Promise<{ data: GenerateFileDTO; url: string }> {
  try {
    const parsedMetadata = JSON.parse(metadata);

    const dto: GenerateFileDTO = plainToInstance(
      GenerateFileDTO,
      parsedMetadata,
    );
    const errors = await validate(dto);

    if (errors.length > 0) {
      let errorMessages: any[] = [];

      errors.map((error) => {
        errorMessages.push(error['constraints']);
      });

      throw new BadRequestException({
        message: httpMessages_EN.helper.status_400,
        errors: errorMessages,
      });
    }

    const url: string = await s3Service.putObject(file);

    return { data: dto, url };
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }

    handleInternalErrorException(
      'helperFunctions',
      'fileUploadHandler',
      loggerMessages.helper.fileUploadHandler.status_500,
      logger,
      error,
    );
  }
}
