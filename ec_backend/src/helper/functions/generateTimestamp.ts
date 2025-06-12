import * as dayjs from 'dayjs';

export default function generateTimestamp(): dayjs.Dayjs {
  const timestamp: dayjs.Dayjs = dayjs();

  return timestamp;
}
