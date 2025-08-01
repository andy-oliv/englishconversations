import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import Quiz from "../pages/quiz/Quiz";
import CompletedQuiz from "../pages/completedQuiz/CompletedQuiz";
import QuizResults from "../pages/quizResults/QuizResults";
import Login from "../pages/login/Login";
import PrivateRoutes from "../components/auth/privateRoutes/PrivateRoutes";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <PrivateRoutes />,
    children: [
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
    ],
  },
]);
