import Quiz from '../../entities/Quiz';
import { faker } from '@faker-js/faker/.';
import {
  generateRandomDifficulty,
  generateRandomLevel,
} from './generateRandomValues';

export default function generateMockQuiz(): Quiz {
  const quiz: Quiz = {
    id: faker.string.uuid(),
    isTest: faker.datatype.boolean(),
    title: faker.book.title(),
    description: faker.book.title(),
    level: generateRandomLevel(),
    difficulty: generateRandomDifficulty(),
    imageUrl: faker.internet.url(),
  };

  return quiz;
}
