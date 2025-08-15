import { useEffect, useState, type ReactElement } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const setData = useUserProgressStore((state) => state.setData);

  useEffect(() => {
    setLoading(true);
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const cached = sessionStorage.getItem("userProgress");
    if (cached) {
      const parsed = UserProgressSchema.safeParse(JSON.parse(cached));
      if (parsed.success) {
        setData(parsed.data);
        setLoading(false);
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
          console.log(parsedResponse.data);
          sessionStorage.setItem(
            "userProgress",
            JSON.stringify(parsedResponse.data)
          );
          setLoading(false);
          return;
        }

        Sentry.captureException(parsedResponse.error.issues, {
          extra: {
            component: "header",
            context: "UserProgressSchema.safeParse",
          },
        });
      } catch (error) {
        setLoading(false);
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
      {loading ? (
        <div className={styles.container}>
          <div className={styles.loadingProgressContainer}>
            <div className={styles.loadingCardContainer}>
              <div className={styles.loadingPicture}></div>
              <div className={styles.loadingTitle}></div>
            </div>
            <div className={styles.loadingProgressInfo}>
              <div className={styles.loadingProgressBar}></div>
              <div className={styles.loadingProgressBar}></div>
              <div className={styles.loadingProgressBar}></div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.progressContainer}>
            <div className={styles.cardContainer}>
              <div className={styles.picture}>
                <img
                  className={styles.chapterCard}
                  src={
                    userProgress
                      ? userProgress.currentChapter.chapter.imageUrl
                      : undefined
                  }
                />
              </div>
              <h2 className={styles.title}>meu progresso</h2>
            </div>
            <div className={styles.progressInfo}>
              <div className={styles.progressInfoContainer}>
                <div className={styles.progressInfoWrapper}>
                  <p>
                    trilhas concluídas:{" "}
                    {userProgress ? userProgress.totalCompletedChapters : ""} de{" "}
                    {userProgress ? userProgress.totalChapters : ""}
                  </p>
                </div>
                <div className={styles.progressInfoWrapper}>
                  <p>
                    unidades concluídas:{" "}
                    {userProgress ? userProgress.totalCompletedUnits : ""} de{" "}
                    {userProgress ? userProgress.totalUnits : ""}
                  </p>
                </div>
                <div className={styles.progressInfoWrapper}>
                  <p>
                    testes concluídos:{" "}
                    {userProgress ? userProgress.totalCompletedTests : ""} de{" "}
                    {userProgress ? userProgress.totalTests : ""}
                  </p>
                </div>
              </div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      width: `${userProgress?.totalChapters ? (userProgress.totalCompletedChapters / userProgress.totalChapters) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      width: `${userProgress?.totalUnits ? (userProgress.totalCompletedUnits / userProgress.totalUnits) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      width: `${userProgress?.totalTests ? (userProgress.totalCompletedTests / userProgress.totalTests) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.userMenuContainer}>
            <UserMenu />
          </div>
        </div>
      )}
    </>
  );
}
