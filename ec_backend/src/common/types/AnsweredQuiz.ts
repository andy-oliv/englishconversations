import AnsweredExercise from './AnsweredExercise';

export default interface AnsweredQuiz {
  id?: string;
  quizId: string;
  studentId: string;
  answers: AnsweredExercise[];
  score: number;
  feedback?: string;
  elapsedTime: number;
}
