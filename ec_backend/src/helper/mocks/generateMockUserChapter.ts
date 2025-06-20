import { faker } from '@faker-js/faker/.';
import UserChapter from '../../common/types/userChapter';
import { Status } from '../../../generated/prisma';

export default function generateMockUserChapter(): UserChapter {
  const userChapter: UserChapter = {
    id: faker.string.uuid(),
    chapterId: faker.string.uuid(),
    userId: faker.string.uuid(),
    status: getRandomStatus(),
    progress: faker.number.float(),
    completedAt: faker.date.anytime(),
  };

  return userChapter;
}

function getRandomStatus(): Status {
  const possibleValues: any = ['LOCKED', 'IN_PROGRESS', 'COMPLETED'];
  const status: Status =
    possibleValues[Math.floor(Math.random() * possibleValues.length)];

  return status;
}
