export default interface QuizAnswer {
  exerciseId: number;
  selectedAnswers?: string[];
  elapsedTime: number;
  isCorrectAnswer: boolean;
}
