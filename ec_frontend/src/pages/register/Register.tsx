import { useCallback, useEffect, useState, type ReactElement } from "react";
import styles from "./styles/Register.module.scss";
import * as Sentry from "@sentry/react";
import { toastMessages } from "../../helper/messages/toastMessages";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { StatesSchema, type State } from "../../schemas/state.schema";
import { CitiesSchema, type City } from "../../schemas/city.schema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type Register } from "../../schemas/registerSchema";
import { Link } from "react-router-dom";
import { environment } from "../../environment/environment";

export default function Register(): ReactElement {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Register>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit: SubmitHandler<Register> = async (data) => {
    const formData = new FormData();
    formData.append(
      "metadata",
      JSON.stringify({
        name: data.name,
        state: data.state === "" ? "AC" : data.state,
        city: data.city === "" ? "Acrelândia" : data.city,
        birthdate: data.birthdate,
        email: data.email,
        password: data.password,
      })
    );
    try {
      await axios.post(`${environment.backendAuthUrl}/register`, formData, {
        withCredentials: true,
      });

      toast.success(toastMessages.register.success, { autoClose: 4000 });
    } catch (error) {
      if (error instanceof AxiosError && error.status === 409) {
        toast.error(toastMessages.register.conflict, { autoClose: 3000 });
      }

      console.log(error);

      if (error instanceof AxiosError && error.status === 400) {
        toast.error(toastMessages.register.badRequest, { autoClose: 4000 });
      }

      Sentry.captureException(error, {
        extra: {
          context: "Register",
          action: "onSubmit",
          error,
        },
      });
    }
  };

  const fetchCities = useCallback(
    async (selectedState: string): Promise<void> => {
      const foundState: State =
        states.length === 0
          ? { id: 12, sigla: "AC", nome: "Acre" }
          : states.find((state) => state.sigla === selectedState) || states[0];
      try {
        const response = await axios.get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${foundState.id}/municipios?orderBy=nome`
        );
        const parsedResponse = CitiesSchema.safeParse(response.data);
        if (parsedResponse.success) {
          setCities(parsedResponse.data);
          return;
        }
        Sentry.captureException(parsedResponse.error.issues, {
          extra: {
            context: "Register",
            action: "fetchCities",
          },
        });
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            context: "Register",
            action: "fetchCities",
          },
        });
      }
    },
    [states]
  );

  useEffect(() => {
    async function fetchStates(): Promise<void> {
      try {
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        const parsedResponse = StatesSchema.safeParse(response.data);
        if (parsedResponse.success) {
          setStates(parsedResponse.data);
          return;
        }
        Sentry.captureException(parsedResponse.error.issues, {
          extra: {
            context: "EditProfile",
            action: "fetchStates()",
          },
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.code === "ERR_NETWORK") {
            toast.error(toastMessages.register.error, {
              autoClose: 3000,
            });
          }
        }
        Sentry.captureException(error, {
          extra: {
            context: "Register",
            action: "fetchStates",
          },
        });
      }
    }

    fetchStates();
  }, []);

  useEffect(() => {
    fetchCities("AC");
  }, [fetchCities]);

  return (
    <>
      <div className={styles.screen}>
        <div className={styles.picture}>
          <img className={styles.logo} src="register_background_full.png" />
        </div>
        <div className={styles.mainContent}>
          <Link to={"/login"} className={styles.returnBtn}>
            voltar
          </Link>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>WELCOME!</h1>
            <p className={styles.info}>
              Registre-se agora para começar a sua jornada
            </p>
          </div>

          <form
            className={styles.registerForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Nome</label>
              <input
                className={styles.formInput}
                type="text"
                id="name"
                {...register("name")}
              />
              {errors.name ? (
                <p className={styles.error}>{errors.name.message}</p>
              ) : null}
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Estado</label>
              <select
                className={styles.formInput}
                id="state"
                defaultValue={"AC"}
                {...register("state")}
                onChange={(event) => fetchCities(event.currentTarget.value)}
              >
                {states.length > 0
                  ? states.map((state) => (
                      <option key={state.id} value={state.sigla}>
                        {state.nome}
                      </option>
                    ))
                  : null}
              </select>
              {errors.state ? (
                <p className={styles.error}>{errors.state.message}</p>
              ) : null}
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Cidade</label>
              <select
                className={styles.formInput}
                id="city"
                defaultValue={"Acrelândia"}
                {...register("city")}
              >
                {cities.length > 0
                  ? cities.map((city) => (
                      <option key={city.id} value={city.nome}>
                        {city.nome}
                      </option>
                    ))
                  : null}
              </select>
              {errors.city ? (
                <p className={styles.error}>{errors.city.message}</p>
              ) : null}
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Data de Nascimento</label>
              <input
                className={`${styles.formInput} ${styles.birthdateInput}`}
                type="date"
                id="birthdate"
                {...register("birthdate")}
              />
              {errors.birthdate ? (
                <p className={styles.error}>{errors.birthdate.message}</p>
              ) : null}
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Email</label>
              <input
                className={styles.formInput}
                id="email"
                type="email"
                {...register("email")}
              />
              {errors.email ? (
                <p className={styles.error}>{errors.email.message}</p>
              ) : null}
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Senha</label>
              <input
                className={styles.formInput}
                id="password"
                type="password"
                {...register("password")}
              />
              {errors.password ? (
                <p className={styles.error}>{errors.password.message}</p>
              ) : null}
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Repetir senha</label>
              <input
                className={styles.formInput}
                type="password"
                id="passwordConfirmation"
                {...register("passwordConfirmation")}
              />
            </div>
            {errors.passwordConfirmation ? (
              <p className={styles.error}>
                {errors.passwordConfirmation.message}
              </p>
            ) : null}
            <button className={styles.btn}>Enviar</button>
          </form>
        </div>
      </div>
    </>
  );
}
