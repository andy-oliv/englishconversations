import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { S3Service } from '../../s3/s3.service';
import handleInternalErrorException from './handleErrorException';
import loggerMessages from '../messages/loggerMessages';
import { Logger } from 'nestjs-pino';
import httpMessages_EN from '../messages/httpMessages.en';
import FormHandlerReturn from '../../common/types/FormHandlerReturn';

type Constructor<T> = new (...args: any[]) => T;

export default async function FormDataHandler(
  DTO: Constructor<any>,
  file: Express.Multer.File,
  metadata: string,
  s3Service: S3Service,
  logger: Logger,
  key?: string,
): Promise<FormHandlerReturn> {
  try {
    if (metadata === undefined) {
      throw new BadRequestException(httpMessages_EN.helper.status_4002);
    }
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

    if (file === undefined) {
      throw new BadRequestException(httpMessages_EN.helper.status_4003);
    }
    const url: string = await s3Service.putObject(file, key);
    return { data: validatedBody, fileUrl: url };
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
