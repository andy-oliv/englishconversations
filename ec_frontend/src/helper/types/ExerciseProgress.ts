export default interface ExerciseProgress {
  exerciseId: number;
  selectedAnswers?: string[];
  isCorrectAnswer: boolean;
  elapsedTime: number;
}
