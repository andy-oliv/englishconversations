import { useState, type ReactElement } from "react";
import styles from "./styles/ForgotPassword.module.scss";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordSchema,
  type ForgotPassword,
} from "../../schemas/forgotPassword.schema";
import axios from "axios";
import { toast } from "react-toastify";
import { environment } from "../../environment/environment";
import { toastMessages } from "../../helper/messages/toastMessages";

export default function ForgotPassword(): ReactElement {
  const onSubmit: SubmitHandler<ForgotPassword> = async (
    data
  ): Promise<void> => {
    try {
      setLoading(true);
      await axios.post(`${environment.backendAuthUrl}/reset/password`, data, {
        withCredentials: true,
      });
      setLoading(false);
      reset();
      toast.success(toastMessages.forgotPassword.success, {
        autoClose: 5000,
      });
    } catch (error) {
      toast.error(toastMessages.internalError, {
        autoClose: 3000,
      });
      console.log(error);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPassword>({
    resolver: zodResolver(ForgotPasswordSchema),
  });
  const [loading, setLoading] = useState<boolean>();

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Esqueceu sua senha?</h1>
        <form
          className={styles.forgotPasswordForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="email"
            placeholder="digite o email cadastrado"
            className={styles.emailInput}
            {...register("email", { required: true })}
          />
          {errors.email ? (
            <p className={styles.error}>{errors.email.message}</p>
          ) : null}
          <button className={`${styles.btn} ${loading ? styles.loading : ""}`}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </>
  );
}
