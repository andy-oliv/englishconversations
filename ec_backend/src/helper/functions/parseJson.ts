import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import httpMessages_EN from '../messages/httpMessages.en';

type Constructor<T> = new (...args: any[]) => T;

export default async function parseJson(
  dto: Constructor<any>,
  metadata: string,
): Promise<any> {
  const parsedMetadata = JSON.parse(metadata);
  const validatedData = plainToInstance(dto, parsedMetadata, {
    enableImplicitConversion: true,
  });

  const errors = await validate(validatedData);

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

  return validatedData;
}
