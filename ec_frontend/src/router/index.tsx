import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Quiz from "../pages/quiz/Quiz";
import CompletedQuiz from "../pages/completedQuiz/CompletedQuiz";
import QuizResults from "../pages/quizResults/QuizResults";
import Login from "../pages/login/Login";
import PrivateRoutes from "../components/auth/privateRoutes/PrivateRoutes";
import Chapter from "../pages/chapter/Chapter";
import Dashboard from "../pages/dashboard/Dashboard";
import Library from "../pages/library/Library";
import IsLogged from "../components/auth/isLogged/IsLogged";
import EditProfile from "../pages/editProfile/EditProfile";
import ResetEmail from "../pages/resetEmail/ResetEmail";
import ResetPassword from "../pages/resetPassword/ResetPassword";

export const router = createBrowserRouter([
  {
    element: <IsLogged />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/chapters",
            element: <Chapter />,
          },
          {
            path: "/library",
            element: <Library />,
          },
        ],
      },
      {
        path: "edit-profile",
        element: <EditProfile />,
      },
      {
        path: "reset-email",
        element: <ResetEmail />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
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
