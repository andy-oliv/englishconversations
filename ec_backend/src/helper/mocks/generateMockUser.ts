import { faker } from '@faker-js/faker/.';
import User from '../../entities/User';

export default function generateMockUser(): User {
  const user: User = {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    bio: faker.person.bio(),
    birthdate: faker.date.past(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  return user;
}
