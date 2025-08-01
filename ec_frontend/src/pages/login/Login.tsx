import { useState, type ReactElement } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import styles from "./styles/Login.module.scss";
import { LoginSchema, type Login } from "../../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Login> = async (data): Promise<void> => {
    try {
      setLoading(true);
      await axios.post("http://localhost:3000/auth/login", data, {
        withCredentials: true,
      });
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <picture className={styles.loginImageFrame}>
          <img src="/man_on_computer.jpg" className={styles.loginImage} />
        </picture>
        <div className={styles.loginFormWrapper}>
          <div className={styles.formBackground}>
            <picture className={styles.logoFrame}>
              <img src="/logo.png" className={styles.logo} />
            </picture>
            <form
              className={styles.loginForm}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={styles.loginInputWrapper}>
                <label id={styles.email}>Email</label>
                <input
                  type="email"
                  placeholder="Digite o seu email"
                  {...register("email", { required: true })}
                />
              </div>
              {errors.email ? (
                <p className={styles.error}>{errors.email.message}</p>
              ) : null}
              <div className={styles.loginInputWrapper}>
                <label>Senha</label>
                <input
                  type="password"
                  placeholder="Digite a sua senha"
                  {...register("password", { required: true })}
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
              <p className={styles.forgotPasswordBtn}>esqueci minha senha</p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
