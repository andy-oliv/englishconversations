import { useEffect, type ReactElement } from "react";
import styles from "./styles/Header.module.scss";
import UserMenu from "../userMenu/UserMenu";
import axios from "axios";
import { environment } from "../../environment/environment";
import type { LoggedUser } from "../../schemas/loggedUser.schema";
import { LoggedUserStore } from "../../stores/loggedUserStore";
import {
  UserProgressSchema,
  type UserProgress,
} from "../../schemas/userProgress.schema";
import { useUserProgressStore } from "../../stores/userProgressStore";
import * as Sentry from "@sentry/react";

export default function Header(): ReactElement {
  const user: LoggedUser | null = LoggedUserStore((state) => state.data);
  const userProgress: UserProgress | null = useUserProgressStore(
    (state) => state.data
  );
  const setData = useUserProgressStore((state) => state.setData);

  useEffect(() => {
    if (!user?.id) return;

    const cached = sessionStorage.getItem("userProgress");
    if (cached) {
      const parsed = UserProgressSchema.safeParse(JSON.parse(cached));
      if (parsed.success) {
        setData(parsed.data);
        return;
      }
      sessionStorage.removeItem("userProgress");
    }

    async function fetchProgressData(): Promise<void> {
      try {
        const response = await axios.get(
          `${environment.backendApiUrl}/user-progress/${user?.id}`,
          {
            withCredentials: true,
          }
        );
        const parsedResponse = UserProgressSchema.safeParse(response.data.data);
        if (parsedResponse.success) {
          setData(parsedResponse.data);
          sessionStorage.setItem(
            "userProgress",
            JSON.stringify(parsedResponse.data)
          );
          return;
        }

        Sentry.captureException(parsedResponse.error.issues, {
          extra: {
            component: "header",
            context: "UserProgressSchema.safeParse",
          },
        });
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            component: "header",
            context: "fetchProgressData()",
          },
        });
      }
    }

    fetchProgressData();
  }, [setData, user?.id]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.progressContainer}>
          <h2>meu progresso</h2>
          <div>
            <div>
              <p>
                trilhas:{" "}
                {userProgress ? userProgress.totalCompletedChapters : ""} de{" "}
                {userProgress ? userProgress.totalChapters : ""}
              </p>
              <div className={styles.progressBar}></div>
            </div>
            <div>
              <p>
                unidades: {userProgress ? userProgress.totalCompletedUnits : ""}{" "}
                de {userProgress ? userProgress.totalUnits : ""}
              </p>
              <div className={styles.progressBar}></div>
            </div>
            <div>
              <p>
                testes: {userProgress ? userProgress.totalCompletedTests : ""}{" "}
                de {userProgress ? userProgress.totalTests : ""}
              </p>
              <div className={styles.progressBar}></div>
            </div>
          </div>
        </div>
        <div className={styles.userMenuContainer}>
          <UserMenu />
        </div>
      </div>
    </>
  );
}
