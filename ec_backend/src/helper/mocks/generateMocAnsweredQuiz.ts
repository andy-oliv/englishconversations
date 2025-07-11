import { faker } from '@faker-js/faker/.';
import AnsweredQuiz from '../../entities/AnsweredQuiz';

export default function generateMockAnsweredQuiz(): AnsweredQuiz {
  const answer: AnsweredQuiz = {
    id: faker.string.uuid(),
    quizId: faker.string.uuid(),
    userId: faker.string.uuid(),
    score: faker.number.int(),
    feedback: faker.person.bio(),
    elapsedTime: faker.number.int(),
  };

  return answer;
}
