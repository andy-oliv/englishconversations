import type { ReactElement } from "react";
import styles from "./styles/Login.module.scss";

export default function Login(): ReactElement {
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
            <form className={styles.loginForm}>
              <div className={styles.loginInputWrapper}>
                <label id={styles.email}>Email</label>
                <input type="email" placeholder="Digite o seu email" />
              </div>
              <div className={styles.loginInputWrapper}>
                <label>Senha</label>
                <input type="password" placeholder="Digite a sua senha" />
              </div>
              <button className={styles.submitBtn}>Enviar</button>
              <p className={styles.forgotPasswordBtn}>esqueci minha senha</p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
