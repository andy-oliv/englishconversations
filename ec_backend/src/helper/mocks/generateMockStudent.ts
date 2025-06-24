import Student from '../../entities/Student';
import { faker } from '@faker-js/faker';

export default function generateMockStudent(): Student {
  const mockStudent: Student = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    age: faker.number.int(),
    birthdate: faker.date.birthdate(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
  };

  return mockStudent;
}
