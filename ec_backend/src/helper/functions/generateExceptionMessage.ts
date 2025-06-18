import ExceptionMessage from '../../common/types/ExceptionMessage';
import generateTimestamp from './generateTimestamp';

export default function generateExceptionMessage(
  context: string,
  action: string,
  message: string,
): ExceptionMessage {
  const exceptionMessage: ExceptionMessage = {
    context,
    action,
    message,
    pid: process.pid,
    timestamp: generateTimestamp(),
  };

  return exceptionMessage;
}
