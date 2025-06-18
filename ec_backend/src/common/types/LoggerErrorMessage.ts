import { Dayjs } from 'dayjs';

export default interface LoggerErrorMessage {
  context: string;
  action: string;
  message: string;
  code: any;
  error: any;
  stack: any;
  pid: number;
  timestamp: Dayjs;
}
