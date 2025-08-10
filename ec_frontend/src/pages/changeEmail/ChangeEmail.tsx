import { useEffect, useState, type ReactElement } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./styles/ChangeEmail.module.scss";
import axios, { AxiosError } from "axios";
import { environment } from "../../environment/environment";
import { toastMessages } from "../../helper/messages/toastMessages";
import { LoggedUserStore } from "../../stores/loggedUserStore";
import { logout } from "../../helper/functions/logout";
import Spinner from "../../components/spinner/Spinner";

export default function ChangeEmail(): ReactElement {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [seconds, setSeconds] = useState<number>(5);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const user = LoggedUserStore((state) => state.data);
  const resetUser = LoggedUserStore((state) => state.resetUser);

  useEffect(() => {
    if (token === undefined) return;

    if (!token && !isDone) {
      navigate("/");
    }

    if (token && !isDone) {
      async function validateToken(token: string): Promise<void> {
        try {
          await axios.patch(
            `${environment.backendAuthUrl}/reset/email?token=${token}`,
            {},
            { withCredentials: true }
          );

          setMessage(toastMessages.updateEmail.success);
          setSuccess(true);
          setIsDone(true);
        } catch (error) {
          console.log(error);
          if (error instanceof AxiosError && error.status === 400) {
            setMessage(toastMessages.updateEmail.error);
            setSuccess(false);
            setIsDone(true);

            return;
          }

          setMessage(toastMessages.internalError);
          setSuccess(false);
          setIsDone(true);
        }
      }

      validateToken(token);
    }
  }, [token, navigate, isDone]);

  useEffect(() => {
    if (!isDone) return;

    if (seconds === 0) {
      logout(user, resetUser, navigate);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, navigate, isDone, user, resetUser]);

  return (
    <>
      {success === null ? (
        <Spinner />
      ) : (
        <div className={styles.container}>
          <div className={styles.decorativeLine}></div>
          <div className={styles.window}>
            {success ? (
              <div className={styles.icon}>
                <img src="/carlton_dancing_meme.gif" />
              </div>
            ) : (
              <div className={styles.icon}>
                <img src="/sad_michael_scott_meme.gif" />
              </div>
            )}

            <h1 className={styles.title}>{message}</h1>
            <p className={styles.message}>
              A página será redirecionada em <span>{seconds} </span>segundos.{" "}
              <Link to="/" className={styles.link}>
                Clique aqui
              </Link>
              <span> para redirecionar automaticamente.</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
