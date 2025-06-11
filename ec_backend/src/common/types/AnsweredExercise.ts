export default interface AnsweredExercise {
  id?: string;
  exerciseId: number;
  studentId: string;
  quizId?: string; //this is the AnsweredQuiz ID, since they relate to each other the same way the exercise and the quiz do
  isRetry?: boolean;
  selectedAnswers?: number[];
  textAnswer?: string;
  audioUrl?: string;
  isCorrectAnswer?: boolean;
  feedback?: string;
  elapsedTime: number;
}
