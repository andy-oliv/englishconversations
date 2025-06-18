import { faker } from '@faker-js/faker/.';
import Video from '../../common/types/Video';

export default function generateMockVideo(): Video {
  const video: Video = {
    id: faker.string.uuid(),
    title: faker.book.title(),
    description: faker.person.bio(),
    url: faker.internet.url(),
    duration: faker.number.int(),
    thumbnailId: faker.string.uuid(),
    unitId: faker.number.int(),
  };

  return video;
}
