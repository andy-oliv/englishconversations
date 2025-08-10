import { useState, type ReactElement } from "react";
import styles from "./styles/ResetPassword.module.scss";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  ChangeEmailSchema,
  type ChangeEmail,
} from "../../schemas/changeEmail.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as Sentry from "@sentry/react";
import { environment } from "../../environment/environment";
import { toast } from "react-toastify";
import { toastMessages } from "../../helper/messages/toastMessages";

export default function ResetPassword(): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeEmail>({
    resolver: zodResolver(ChangeEmailSchema),
  });

  const onSubmit: SubmitHandler<ChangeEmail> = async (data) => {
    try {
      setLoading(true);
      await axios.post(`${environment.backendAuthUrl}/reset/password`, data, {
        withCredentials: true,
      });

      setLoading(false);
      reset();
      toast.success(toastMessages.changePassword.success, {
        autoClose: 3000,
      });
      navigate(-1);
    } catch (error) {
      setLoading(false);
      toast.error(toastMessages.internalError, { autoClose: 3000 });
      Sentry.captureException(error, {
        extra: {
          context: "/reset-password",
          action: "OnSubmit",
        },
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.window}>
          <div className={styles.decorativeLine}></div>
          <h1>Alterar senha</h1>
          <p className={styles.description}>
            Para alterar a sua senha, digite o email cadastrado abaixo:
          </p>
          <form
            className={styles.changeEmailForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="email"
              placeholder="Digite o seu email"
              id="email"
              className={styles.emailInput}
              {...register("email", { required: true })}
              autoComplete="on"
            />
            {errors.email ? (
              <p className={styles.error}>{errors.email.message}</p>
            ) : null}
            <div className={styles.btnContainer}>
              <button
                className={styles.btn}
                type="button"
                onClick={() => navigate(-1)}
              >
                Voltar
              </button>
              <button
                className={`${styles.btn} ${loading ? styles.loading : null}`}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
