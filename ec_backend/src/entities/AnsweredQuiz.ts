export default interface AnsweredQuiz {
  id?: string;
  quizId: string;
  studentId: string;
  score: number;
  feedback?: string;
  elapsedTime: number;
}
