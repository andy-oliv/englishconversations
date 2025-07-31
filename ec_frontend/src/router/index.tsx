import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import Quiz from "../pages/quiz/Quiz";
import CompletedQuiz from "../pages/completedQuiz/CompletedQuiz";
import QuizResults from "../pages/quizResults/QuizResults";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/quiz",
    element: <Quiz />,
  },
  {
    path: "/completed-quiz",
    element: <CompletedQuiz />,
  },
  {
    path: "/quiz-results",
    element: <QuizResults />,
  },
]);
