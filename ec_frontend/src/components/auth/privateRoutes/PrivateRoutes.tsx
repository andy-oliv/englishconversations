import axios from "axios";
import { useEffect, useState, type ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import styles from "./styles/PrivateRoutes.module.scss";
import { LoggedUserStore } from "../../../stores/loggedUserStore";
import { LoggedUserSchema } from "../../../schemas/loggedUser.schema";
import { fetchUser } from "../../../helper/functions/fetchUser";

export default function PrivateRoutes(): ReactElement {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const { setUser } = LoggedUserStore();

  useEffect(() => {
    const isAuthenticated = async (): Promise<void> => {
      try {
        const response = await axios.get(
          "http://localhost:3000/auth/student-session",
          { withCredentials: true }
        );

        const parsedResponse = LoggedUserSchema.safeParse(response.data.data);

        if (parsedResponse.success) {
          setUser(parsedResponse.data);
          sessionStorage.setItem(
            "loggedUser",
            JSON.stringify(parsedResponse.data)
          );
          await fetchUser(parsedResponse.data.id);
          setIsAuth(true);
          return;
        }

        setIsAuth(false);
        console.log(parsedResponse.error?.issues);
      } catch (error) {
        console.log(error);
        setIsAuth(false);
      }
    };

    isAuthenticated();
  }, [setUser]);

  if (isAuth === null)
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.title}>Carregando...</h1>
      </div>
    );

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}
