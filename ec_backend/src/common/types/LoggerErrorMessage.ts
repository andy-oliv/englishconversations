import { Dayjs } from 'dayjs';

export default interface LoggerErrorMessage {
  message: string;
  code: any;
  error: any;
  stack: any;
  pid: number;
  timestamp: Dayjs;
}
