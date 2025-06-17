import Quiz from '../../common/types/Quiz';
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
    fileId: faker.string.uuid(),
    unitId: faker.number.int(),
  };

  return quiz;
}
