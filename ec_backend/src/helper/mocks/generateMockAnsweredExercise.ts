import { faker } from '@faker-js/faker/.';
import AnsweredExercise from '../../entities/AnsweredExercise';

export default function generateMockAnsweredExercise(): AnsweredExercise {
  const answer: AnsweredExercise = {
    id: faker.string.uuid(),
    exerciseId: faker.number.int(),
    studentId: faker.string.uuid(),
    quizId: faker.string.uuid(),
    isRetry: faker.datatype.boolean(),
    selectedAnswers: [faker.person.middleName()],
    textAnswer: faker.book.title(),
    fileId: faker.string.uuid(),
    isCorrectAnswer: faker.datatype.boolean(),
    feedback: faker.person.bio(),
    elapsedTime: faker.number.int(),
  };

  return answer;
}
