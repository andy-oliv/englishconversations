import { Dayjs } from 'dayjs';

export default interface ExceptionMessage {
  context: string;
  action: string;
  message: string;
  pid: number;
  timestamp: Dayjs;
}
