import { faker } from '@faker-js/faker/.';
import Video from '../../entities/Video';

export default function generateMockVideo(): Video {
  const video: Video = {
    id: faker.string.uuid(),
    title: faker.book.title(),
    description: faker.person.bio(),
    url: faker.internet.url(),
    duration: faker.number.int(),
    thumbnailUrl: faker.internet.url(),
  };

  return video;
}
