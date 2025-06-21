import { faker } from '@faker-js/faker/.';
import Unit from '../../common/types/Unit';

export default function generateMockUnit(): Unit {
  const unit: Unit = {
    id: faker.number.int(),
    name: faker.person.firstName(),
    description: faker.person.bio(),
    chapterId: faker.string.uuid(),
  };

  return unit;
}
