import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import styles from "./styles/EditProfile.module.scss";
import { UserStore } from "../../stores/userStore";
import dayjs from "dayjs";
import { CitiesSchema, type City } from "../../schemas/city.schema";
import { StatesSchema, type State } from "../../schemas/state.schema";
import axios, { AxiosError } from "axios";
import * as Sentry from "@sentry/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type UserEdit, UserEditSchema } from "../../schemas/userEdit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { environment } from "../../environment/environment";
import { LoggedUserSchema } from "../../schemas/loggedUser.schema";
import { LoggedUserStore } from "../../stores/loggedUserStore";
import { UserSchema } from "../../schemas/user.schema";
import Modal from "../../components/modal/Modal";
import { toast } from "react-toastify";
import { toastMessages } from "../../helper/messages/toastMessages";

export default function EditProfile(): ReactElement {
  function handleImgCrop(blob: Blob): void {
    setImgBlob(blob);
    setImgShown(URL.createObjectURL(blob));
  }

  function handleFileChange(): void {
    if (avatarFile.current?.files?.[0]) {
      setImgShown(URL.createObjectURL(avatarFile.current.files[0]));
    }
  }

  const user = UserStore((state) => state.data);
  const setLoggedUser = LoggedUserStore((state) => state.setUser);
  const setUser = UserStore((state) => state.setUser);
  const [edit, setEdit] = useState<boolean>(false);
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoader, setSaveLoader] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const avatarFile = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit } = useForm<UserEdit>({
    resolver: zodResolver(UserEditSchema),
  });
  const [imgBlob, setImgBlob] = useState<Blob | null>(null);
  const [imgShown, setImgShown] = useState<string | null>(null);

  const onSubmit: SubmitHandler<UserEdit> = async (data) => {
    setSaveLoader(true);
    const formData = new FormData();
    formData.append("metadata", JSON.stringify(data));

    if (imgBlob) {
      formData.append("file", imgBlob);
    }

    try {
      const response = await axios.patch(
        `${environment.backendApiUrl}/users/${user?.id}`,
        formData,
        { withCredentials: true }
      );
      const parsedLoggedUser = LoggedUserSchema.safeParse(response.data.data);
      const parsedUser = UserSchema.safeParse(response.data.data);

      if (parsedLoggedUser.success && parsedUser.success) {
        setLoggedUser(parsedLoggedUser.data);
        sessionStorage.setItem(
          "loggedUser",
          JSON.stringify(parsedLoggedUser.data)
        );
        setUser(parsedUser.data);
        sessionStorage.setItem("user", JSON.stringify(parsedUser.data));
        setEdit(false);
        setSaveLoader(false);
        return;
      }

      Sentry.captureMessage("Zod parsing error", {
        extra: {
          loggedUserParsingError: parsedLoggedUser.error?.issues,
          userParsingError: parsedUser.error?.issues,
        },
      });
      setSaveLoader(false);
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          context: "EditProfile",
          action: "onSubmit",
        },
      });
      setSaveLoader(false);
    }
  };

  const fetchCities = useCallback(
    async (selectedState: string) => {
      if (states.length === 0 || !states) return;
      const foundState: State =
        states.find((state) => state.sigla === selectedState) || states[0];

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
            context: "EditProfile",
            action: "fetchCities()",
          },
        });
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            context: "EditProfile",
            action: "fetchCities()",
          },
        });
      }
    },
    [states]
  );

  useEffect(() => {
    setLoading(true);
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
        setLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.code === "ERR_NETWORK") {
            toast.error(toastMessages.editProfile.error, {
              autoClose: 3000,
            });
          }
        }
        Sentry.captureException(error, {
          extra: {
            context: "EditProfile",
            action: "fetchStates()",
          },
        });
        setLoading(false);
      }
    }

    fetchStates();
  }, []);

  useEffect(() => {
    if (user?.state && states.length > 0) {
      fetchCities(user.state);
      setLoading(false);
      return;
    }

    if (states && states.length > 0) {
      fetchCities(states[0].sigla);
      setLoading(false);
    }
  }, [fetchCities, user?.state, states]);

  return (
    <>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.imageLoader}></div>
          <div className={styles.infoLoader}>
            <div className={styles.userInfo}></div>
            <div className={styles.userInfo}></div>
            <div className={styles.userInfo}></div>
            <div className={styles.userInfo}></div>
            <div className={styles.userInfo}></div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          {isOpen ? (
            <Modal
              onClose={() => setIsOpen(false)}
              src={
                avatarFile.current?.files?.[0]
                  ? avatarFile.current.files[0]
                  : null
              }
              getBlob={handleImgCrop}
            />
          ) : null}

          <h1 className={styles.title}>
            {edit ? "EDITAR PERFIL" : "MEU PERFIL"}
          </h1>
          {edit ? (
            <div className={styles.infoContainer}>
              <div>
                <div
                  className={styles.editPicture}
                  onMouseEnter={() => setHover(true)}
                  onMouseOut={() => setHover(false)}
                >
                  <img
                    src={imgShown ? imgShown : user?.avatarUrl}
                    className={styles.editAvatar}
                  />
                  <input
                    type="file"
                    className={styles.fileInput}
                    id="file"
                    accept=".png, .jpg, .jpeg"
                    ref={avatarFile}
                    onChange={() => handleFileChange()}
                  />
                  <div
                    className={`${styles.frame} ${hover ? styles.active : null}`}
                  >
                    <div className={styles.icon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        width={70}
                        viewBox="0 0 24 24"
                        strokeWidth="1"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <button
                  className={`${styles.imgEditBtn} ${!avatarFile.current?.files?.[0] ? styles.inactive : ""}`}
                  onClick={() => setIsOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-crop-icon lucide-crop"
                  >
                    <path d="M6 2v14a2 2 0 0 0 2 2h14" />
                    <path d="M18 22V8a2 2 0 0 0-2-2H2" />
                  </svg>
                  Editar imagem
                </button>
              </div>
              <form className={styles.profileEditForm}>
                <div className={styles.formWrapper}>
                  <label className={styles.inputLabel} htmlFor="username">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="username"
                    autoComplete="name"
                    {...register("name", { required: false })}
                    defaultValue={user?.name}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formWrapper}>
                  <label className={styles.inputLabel} htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    id="bio"
                    className={styles.formInput}
                    {...register("bio", { required: false })}
                    defaultValue={user && user.bio ? user.bio : ""}
                  />
                </div>
                <div className={styles.formWrapper}>
                  <label className={styles.inputLabel} htmlFor="states">
                    Estado
                  </label>
                  <select
                    className={styles.formInput}
                    id="states"
                    {...register("state", { required: false })}
                    defaultValue={
                      user?.state
                        ? user.state
                        : states && states.length > 0
                          ? states[0].sigla
                          : ""
                    }
                    onChange={(event) => fetchCities(event.target.value)}
                  >
                    {states.length > 0
                      ? states.map((state) => (
                          <option key={state.id} value={state.sigla}>
                            {state.sigla}
                          </option>
                        ))
                      : null}
                  </select>
                </div>
                <div className={styles.formWrapper}>
                  <label className={styles.inputLabel} htmlFor="city">
                    Cidade
                  </label>
                  <select
                    id="city"
                    {...register("city", { required: false })}
                    defaultValue={
                      user?.city
                        ? user.city
                        : cities && cities.length > 0
                          ? cities[0].nome
                          : ""
                    }
                    className={styles.formInput}
                  >
                    {cities.length > 0
                      ? cities.map((city) => (
                          <option key={city.id} value={city.nome}>
                            {city.nome}
                          </option>
                        ))
                      : null}
                  </select>
                </div>

                <div className={styles.formWrapper}>
                  <label className={styles.inputLabel} htmlFor="birthdate">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    id="birthdate"
                    {...register("birthdate", { required: false })}
                    defaultValue={
                      user && user.birthdate !== null
                        ? dayjs(user.birthdate)
                            .add(1, "day")
                            .format("YYYY-MM-DD")
                        : ""
                    }
                    className={styles.formInput}
                  />
                </div>
              </form>
            </div>
          ) : (
            <div className={styles.infoContainer}>
              <div className={styles.picture}>
                <img src={user?.avatarUrl} className={styles.avatar} />
              </div>
              <div className={styles.infoWrapper}>
                <div className={styles.inputWrapper}>
                  <h3 className={styles.infoTitle}>Nome</h3>
                  <p className={styles.info}>{user?.name}</p>
                </div>
                <div className={styles.inputWrapper}>
                  <h3 className={styles.infoTitle}>Bio</h3>
                  <p className={styles.info}>{user?.bio}</p>
                </div>
                <div className={styles.inputWrapper}>
                  <h3 className={styles.infoTitle}>Estado</h3>
                  <p className={styles.info}>{user?.state}</p>
                </div>
                <div className={styles.inputWrapper}>
                  <h3 className={styles.infoTitle}>Cidade</h3>
                  <p className={styles.info}>{user?.city}</p>
                </div>

                <div className={styles.inputWrapper}>
                  <h3 className={styles.infoTitle}>Data de nascimento</h3>
                  <p className={styles.info}>
                    {user && user.birthdate
                      ? dayjs(user?.birthdate)
                          .add(1, "day")
                          .format("DD/MM/YYYY")
                      : "Data de nascimento não informada"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {edit ? (
            <div className={styles.btnWrapper}>
              <button
                className={`${styles.btn} ${saveLoader ? styles.saving : null}`}
                onClick={handleSubmit(onSubmit)}
              >
                {saveLoader ? "Salvando..." : "Salvar"}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setEdit(false)}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button className={styles.btn} onClick={() => setEdit(true)}>
              Editar
            </button>
          )}
        </div>
      )}
    </>
  );
}
