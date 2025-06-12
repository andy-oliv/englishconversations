import { Dayjs } from 'dayjs';

export default interface ExceptionMessage {
  message: string;
  pid: number;
  timestamp: Dayjs;
}
