import { useState, type ReactElement } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import styles from "./styles/Login.module.scss";
import { LoginSchema, type Login } from "../../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import ForgotPassword from "../../components/forgotPassword/ForgotPassword";
import * as Sentry from "@sentry/react";
import { environment } from "../../environment/environment";
import { toast } from "react-toastify";
import { toastMessages } from "../../helper/messages/toastMessages";

export default function Login(): ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loginActive, setLoginActive] = useState<boolean>(true);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Login> = async (data): Promise<void> => {
    try {
      setLoading(true);
      await axios.post(`${environment.backendAuthUrl}/login`, data, {
        withCredentials: true,
      });

      setLoading(false);
      reset();
      Sentry.setUser({
        email: data.email,
      });
      navigate("/");
    } catch (error) {
      setLoading(false);

      if (error instanceof AxiosError && error.status === 400) {
        toast.error(toastMessages.login.badRequest, {
          autoClose: 3000,
        });
        return;
      }
      toast.error(toastMessages.internalError, {
        autoClose: 3000,
      });
      Sentry.captureException(error, {
        extra: {
          endpoint: "/login",
          userEmail: data.email,
        },
      });
    }
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <picture className={styles.loginImageFrame}>
          <img src="/teacher_andrew_2.jpg" className={styles.loginImage} />
        </picture>
        <div className={styles.loginFormWrapper}>
          <div
            className={`${styles.formBackground} ${loginActive ? styles.activeLogin : ""}`}
          >
            <picture className={styles.logoFrame}>
              <img src="/logo.png" className={styles.logo} />
            </picture>
            <form
              className={styles.loginForm}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={styles.loginInputWrapper}>
                <label id={styles.email} htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Digite o seu email"
                  id="email"
                  autoComplete="on"
                  {...register("email", { required: true })}
                  className={styles.loginInput}
                />
              </div>
              {errors.email ? (
                <p className={styles.error}>{errors.email.message}</p>
              ) : null}
              <div className={styles.loginInputWrapper}>
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  placeholder="Digite a sua senha"
                  autoComplete="on"
                  id="password"
                  {...register("password", { required: true })}
                  className={styles.loginInput}
                />
              </div>
              {errors.password ? (
                <p className={styles.error}>{errors.password.message}</p>
              ) : null}
              <button
                className={`${styles.submitBtn} ${isLoading ? styles.loading : ""}`}
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
              <div className={styles.options}>
                <p
                  className={styles.forgotPasswordBtn}
                  onClick={() => setLoginActive(false)}
                >
                  esqueci minha senha
                </p>
                <Link to={"/register"} className={styles.registerBtn}>
                  registrar
                </Link>
              </div>
            </form>
          </div>
          <div
            className={`${styles.forgotPasswordWrapper} ${!loginActive ? styles.activePassword : ""}`}
          >
            <div className={styles.icon} onClick={() => setLoginActive(true)}>
              <p>voltar</p>
            </div>
            <ForgotPassword />
          </div>
        </div>
      </div>
    </>
  );
}
