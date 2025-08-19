export default interface AnsweredQuiz {
  id?: string;
  quizId: string;
  userId: string;
  score: number;
  feedback?: string;
  elapsedTime: number;
  userContentId: number;
}
