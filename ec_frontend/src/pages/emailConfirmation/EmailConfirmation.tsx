import { useEffect, type ReactElement } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./styles/EmailConfirmation.module.scss";
import axios, { AxiosError } from "axios";
import { environment } from "../../environment/environment";
import * as Sentry from "@sentry/react";
import { toast } from "react-toastify";
import { toastMessages } from "../../helper/messages/toastMessages";

export default function EmailConfirmation(): ReactElement {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });

    async function confirmEmail(): Promise<void> {
      try {
        await axios.patch(
          `${environment.backendAuthUrl}/registered?token=${token}`,
          {},
          { withCredentials: true }
        );
      } catch (error) {
        if (error instanceof AxiosError && error.code === "ERR_BAD_REQUEST") {
          toast.error(toastMessages.emailConfirmation.badRequest, {
            autoClose: 3000,
          });
        }

        if (error instanceof AxiosError && error.code === "ERR_BAD_RESPONSE") {
          toast.error(toastMessages.internalError, {
            autoClose: 3000,
          });
        }
        Sentry.captureException(error, {
          extra: {
            context: "EmailConfirmation",
            action: "confirmEmail",
            error,
          },
        });
      }
    }

    confirmEmail();
  }, [token, navigate]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.decorativeLine}></div>
        <div className={styles.window}>
          <div className={styles.picture}>
            <img src="logo.png" className={styles.image} />
          </div>
          <div className={styles.welcomeWrapper}>
            <p className={styles.message}>
              Sua conta já está ativa e está tudo pronto para você explorar um
              novo jeito de estudar inglês! Prepare-se para{" "}
              <span className={styles.highlight}>aprender</span>,{" "}
              <span className={styles.highlight}>praticar</span> e{" "}
              <span className={styles.highlight}>crescer</span> em cada aula.
            </p>

            <Link to="/" className={styles.btn}>
              Iniciar sua jornada
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
