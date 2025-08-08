import { type ReactElement } from "react";
import { LoggedUserStore } from "../../../stores/loggedUserStore";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../../spinner/Spinner";

export default function IsLogged(): ReactElement {
  const loggedUser = LoggedUserStore((state) => state.data);

  if (loggedUser === undefined) {
    return <Spinner />;
  }

  if (loggedUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
