export default interface AnsweredExercise {
  id?: string;
  exerciseId: number;
  studentId: string;
  selectedAnswers?: number[];
  textAnswer?: string;
  audioUrl?: string;
  isCorrectAnswer: boolean;
  feedback?: string;
  elapsedTime: number;
}
