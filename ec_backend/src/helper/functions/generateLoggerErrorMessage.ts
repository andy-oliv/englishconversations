import LoggerErrorMessage from '../../common/types/LoggerErrorMessage';
import generateTimestamp from './generateTimestamp';

export default function generateLoggerErrorMessage(
  context: string,
  action: string,
  message: string,
  error: any,
): LoggerErrorMessage {
  const errorMessage: LoggerErrorMessage = {
    context,
    action,
    message,
    code: error.code,
    error: error.message,
    stack: error.stack,
    pid: process.pid,
    timestamp: generateTimestamp(),
  };

  return errorMessage;
}
