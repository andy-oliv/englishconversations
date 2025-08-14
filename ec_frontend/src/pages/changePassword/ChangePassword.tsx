import { useEffect, useState, type ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./styles/ChangePassword.module.scss";
import axios, { AxiosError } from "axios";
import { environment } from "../../environment/environment";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordSchema,
  type ChangePassword,
} from "../../schemas/changePassword.schema";
import { toast } from "react-toastify";
import { toastMessages } from "../../helper/messages/toastMessages";
import { logout } from "../../helper/functions/logout";
import { LoggedUserStore } from "../../stores/loggedUserStore";

export default function ChangePassword(): ReactElement {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const [success, setSuccess] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(5);
  const user = LoggedUserStore((state) => state.data);
  const resetUser = LoggedUserStore((state) => state.resetUser);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePassword>({
    resolver: zodResolver(ChangePasswordSchema),
  });
  const onSubmit: SubmitHandler<ChangePassword> = async (data) => {
    try {
      await axios.patch(
        `${environment.backendAuthUrl}/reset/password?token=${token}`,
        data,
        { withCredentials: true }
      );
      toast.success(toastMessages.updatePassword.success, { autoClose: 4000 });
      setSuccess(true);
    } catch (error) {
      if (error instanceof AxiosError && error.status === 400) {
        toast.error(toastMessages.updatePassword.error, { autoClose: 4000 });
        return;
      }

      toast.error(toastMessages.internalError, { autoClose: 4000 });
    }
  };

  useEffect(() => {
    if (!success) return;

    if (seconds === 0) {
      if (user) {
        logout(user, resetUser, navigate);
        return;
      }

      navigate("/login", { replace: true });
      return;
    }

    const interval = setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [success, user, resetUser, navigate, seconds]);

  return (
    <>
      {success ? (
        <div className={styles.container}>
          <div className={styles.decorativeLine}></div>
          <div className={styles.window}>
            <div className={styles.icon}>
              <img src="/carlton_dancing_meme.gif" />
            </div>
            <h1 className={styles.title}>
              {toastMessages.updatePassword.success}
            </h1>
            <p className={styles.message}>
              A página será redirecionada em <span>{seconds} </span>segundos.{" "}
              <button
                type="button"
                className={styles.link}
                onClick={() =>
                  user
                    ? logout(user, resetUser, navigate)
                    : navigate("/login", { replace: true })
                }
              >
                Clique aqui
              </button>
              <span> para redirecionar automaticamente.</span>
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.decorativeLine}></div>
          <div className={styles.window}>
            <h1 className={styles.title}>É hora de criar a sua nova senha</h1>
            <form
              className={styles.passwordResetForm}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={styles.inputWrapper}>
                <label htmlFor="email" className={styles.inputLabel}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Digite o email cadastrado"
                  className={styles.formInput}
                  {...register("email", { required: true })}
                />
              </div>
              {errors.email ? (
                <p className={styles.error}>{errors.email.message}</p>
              ) : null}
              <div className={styles.inputWrapper}>
                <label htmlFor="email" className={styles.inputLabel}>
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="Digite a nova senha"
                  className={styles.formInput}
                  {...register("password", { required: true })}
                />
              </div>
              {errors.password ? (
                <p className={styles.error}>{errors.password.message}</p>
              ) : null}
              <button className={styles.submitBtn}>Enviar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
