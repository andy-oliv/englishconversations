import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { S3Service } from '../../../s3/s3.service';
import { Logger } from 'nestjs-pino';
import FormHandlerReturn from '../../../common/types/FormHandlerReturn';
import httpMessages_EN from '../../messages/httpMessages.en';
import handleInternalErrorException from '../handleErrorException';
import loggerMessages from '../../messages/loggerMessages';

type Constructor<T> = new (...args: any[]) => T;

export default async function updateFormHandler(
  s3Service: S3Service,
  logger: Logger,
  key?: string,
  DTO?: Constructor<any>,
  file?: Express.Multer.File,
  metadata?: string,
): Promise<Partial<FormHandlerReturn>> {
  try {
    if (metadata) {
      const parsedMetadata = JSON.parse(metadata);

      const validatedBody = plainToInstance(DTO, parsedMetadata, {
        enableImplicitConversion: true,
      });
      const errors = await validate(validatedBody);

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

      if (file) {
        const url: string = await s3Service.putObject(file, key);
        return { data: validatedBody, fileUrl: url };
      }

      return { data: validatedBody };
    }

    if (file) {
      const url: string = await s3Service.putObject(file, key);
      return { fileUrl: url };
    }
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }

    handleInternalErrorException(
      'helperFunctions',
      'updateFormHandler',
      loggerMessages.helper.fileUploadHandler.status_500,
      logger,
      error,
    );
  }
}
