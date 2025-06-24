import { faker } from '@faker-js/faker/.';
import { Status } from '../../../generated/prisma';
import UserUnit from '../../entities/UserUnit';

export default function generateMockUserUnit(): UserUnit {
  const userUnit: UserUnit = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    unitId: faker.number.int(),
    status: getRandomStatus(),
    progress: faker.number.float(),
    completedAt: faker.date.anytime(),
  };

  return userUnit;
}

function getRandomStatus(): Status {
  const possibleValues: any = ['LOCKED', 'IN_PROGRESS', 'COMPLETED'];
  const status: Status =
    possibleValues[Math.floor(Math.random() * possibleValues.length)];

  return status;
}
