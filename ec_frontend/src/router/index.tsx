import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Quiz from "../pages/quiz/Quiz";
import CompletedQuiz from "../pages/completedQuiz/CompletedQuiz";
import QuizResults from "../pages/quizResults/QuizResults";
import Login from "../pages/login/Login";
import PrivateRoutes from "../components/auth/privateRoutes/PrivateRoutes";
import Dashboard from "../pages/dashboard/Dashboard";
import Library from "../pages/library/Library";
import IsLogged from "../components/auth/isLogged/IsLogged";
import EditProfile from "../pages/editProfile/EditProfile";
import ResetEmail from "../pages/resetEmail/ResetEmail";
import ResetPassword from "../pages/resetPassword/ResetPassword";
import ChangeEmail from "../pages/changeEmail/ChangeEmail";
import ChangePassword from "../pages/changePassword/ChangePassword";
import Hub from "../pages/hub/Hub";
import Video from "../pages/video/Video";
import Slideshow from "../pages/slideshow/Slideshow";
import Settings from "../pages/settings/Settings";
import Register from "../pages/register/Register";
import EmailConfirmation from "../pages/emailConfirmation/EmailConfirmation";
import RecordedClasses from "../pages/recordedClasses/RecordedClasses";
import RecordedClassView from "../pages/recordedClassView/RecordedClassView";

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
            path: "edit-profile",
            element: <EditProfile />,
          },
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/library",
            element: <Library />,
          },
          {
            path: "/recordings",
            element: <RecordedClasses />,
          },
          {
            path: "/settings",
            element: <Settings />,
          },
        ],
      },
      {
        path: "edit-email",
        element: <ResetEmail />,
      },
      {
        path: "email-reset",
        element: <ChangeEmail />,
      },
      {
        path: "edit-password",
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
      {
        path: "/hub",
        element: <Hub />,
        children: [
          {
            path: "video",
            element: <Video />,
          },
          {
            path: "slideshow",
            element: <Slideshow />,
          },
        ],
      },
      {
        path: "watch",
        element: <RecordedClassView />,
      },
    ],
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "password-reset",
    element: <ChangePassword />,
  },
  {
    path: "confirm",
    element: <EmailConfirmation />,
  },
]);
