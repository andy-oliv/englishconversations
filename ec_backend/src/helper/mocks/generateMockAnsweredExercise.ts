import { faker } from '@faker-js/faker/.';
import AnsweredExercise from '../../entities/AnsweredExercise';

export default function generateMockAnsweredExercise(): AnsweredExercise {
  const answer: AnsweredExercise = {
    id: faker.string.uuid(),
    exerciseId: faker.number.int(),
    userId: faker.string.uuid(),
    answeredQuizId: faker.string.uuid(),
    isRetry: faker.datatype.boolean(),
    selectedAnswers: [faker.person.middleName()],
    textAnswer: faker.book.title(),
    isCorrectAnswer: faker.datatype.boolean(),
    feedback: faker.person.bio(),
    elapsedTime: faker.number.int(),
  };

  return answer;
}
