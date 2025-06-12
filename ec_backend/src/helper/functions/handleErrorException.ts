import { Logger } from 'nestjs-pino';
import LoggerErrorMessage from '../../common/types/LoggerErrorMessage';
import generateLoggerErrorMessage from './generateLoggerErrorMessage';
import ExceptionMessage from '../../common/types/ExceptionMessage';
import generateExceptionMessage from './generateExceptionMessage';
import { InternalServerErrorException } from '@nestjs/common';
import httpMessages_EN from '../messages/httpMessages.en';

export default function handleInternalErrorException(
  loggerMessage: string,
  logger: Logger,
  error: any,
): void {
  const loggerErrorMessage: LoggerErrorMessage = generateLoggerErrorMessage(
    loggerMessage,
    error,
  );
  logger.error(loggerErrorMessage);

  const exceptionMessage: ExceptionMessage = generateExceptionMessage(
    httpMessages_EN.general.status_500,
  );
  throw new InternalServerErrorException(exceptionMessage);
}
