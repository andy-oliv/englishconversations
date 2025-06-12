import ExceptionMessage from '../../common/types/ExceptionMessage';
import generateTimestamp from './generateTimestamp';

export default function generateExceptionMessage(
  message: string,
): ExceptionMessage {
  const exceptionMessage: ExceptionMessage = {
    message,
    pid: process.pid,
    timestamp: generateTimestamp(),
  };

  return exceptionMessage;
}
