import { faker } from '@faker-js/faker/.';
import VideoProgress from '../../entities/VideoProgress';

export default function generateMockVideoProgress(): VideoProgress {
  const videoProgress: VideoProgress = {
    id: faker.number.int(),
    userId: faker.string.uuid(),
    videoId: faker.string.uuid(),
    progress: faker.number.int(),
    watchedDuration: faker.number.int(),
    watchedCount: faker.number.int(),
    lastWatchedAt: faker.date.future(),
    startedAt: faker.date.recent(),
    completedAt: faker.date.future(),
    completed: faker.datatype.boolean(),
    isFavorite: faker.datatype.boolean(),
    note: faker.person.bio(),
  };

  return videoProgress;
}
