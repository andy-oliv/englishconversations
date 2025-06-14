import { faker } from '@faker-js/faker/.';
import Exercise from '../../common/types/Exercise';

export default function generateMockExercise(): Exercise {
  const exercise: Exercise = {
    id: faker.number.int(),
    type: generateRandomExerciseType(),
    description: faker.book.title(),
    level: generateRandomLevel(),
    difficulty: generateRandomDifficulty(),
    options: [
      faker.book.title(),
      faker.book.title(),
      faker.book.title(),
      faker.book.title(),
    ],
    correctAnswer: [faker.book.title()],
    quizId: faker.string.uuid(),
  };

  return exercise;
}

function generateRandomExerciseType(): any {
  const exerciseTypes: string[] = [
    'FILL_IN_THE_BLANKS',
    'MULTIPLE_CHOICE_QUESTION',
    'CORRECT_OR_INCORRECT',
    'MATCH_THE_COLUMNS',
    'UNSCRAMBLE_WORD',
    'UNSCRAMBLE_SENTENCE',
    'LISTENING_COMPREHENSION',
    'PICTIONARY',
    'FREE_ANSWER_QUESTION',
    'TRANSLATION',
    'SPEAKING_EXERCISE',
    'VIDEO_QUESTION',
  ];

  const selectedExerciseType: any =
    exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
  return selectedExerciseType;
}

function generateRandomLevel(): any {
  const levels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

  const selectedLevel: any = levels[Math.floor(Math.random() * levels.length)];
  return selectedLevel;
}

function generateRandomDifficulty(): any {
  const difficulties: string[] = ['EASY', 'MEDIUM', 'HARD'];

  const selectedDifficulty: any =
    difficulties[Math.floor(Math.random() * difficulties.length)];
  return selectedDifficulty;
}
