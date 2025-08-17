import { faker } from '@faker-js/faker/.';
import Unit from '../../entities/Unit';

export default function generateMockUnit(): Unit {
  const unit: Unit = {
    id: faker.number.int(),
    name: faker.person.firstName(),
    description: faker.person.bio(),
    order: faker.number.int(),
    chapterId: faker.string.uuid(),
  };

  return unit;
}
