import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/Dashboard.module.scss";
import axios, { AxiosError } from "axios";
import { environment } from "../../environment/environment";
import * as Sentry from "@sentry/react";
import UnitCard from "../../components/unitCard/UnitCard";
import ContentCard from "../../components/contentCard/ContentCard";
import type { ContentType } from "../../components/contentCard/ContentCard.types";
import { useUserStore } from "../../stores/userStore";
import { useCurrentChapterStore } from "../../stores/currentChapterStore";
import { CurrentChapterSchema } from "../../schemas/currentChapter.schema";
import type { Unit } from "../../schemas/unit.schema";

export default function Dashboard(): ReactElement {
  function handleCardClick(title: string): void {
    setClickedCard(title);
    const unit: Unit | undefined = units?.find((unit) => unit.name === title);
    if (unit) {
      setCurrentUnitId(unit.id);
      setSelectedUnit(unit);
    }
  }

  const user = useUserStore((state) => state.data);
  const units = useCurrentChapterStore((state) => state.data?.units);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [clickedCard, setClickedCard] = useState<string | null>(null);
  const [noUnits, setNoUnits] = useState<boolean>(false);

  const setCurrentChapter = useCurrentChapterStore(
    (state) => state.setCurrentChapter
  );
  const setCurrentUnitId = useCurrentChapterStore(
    (state) => state.setCurrentUnitId
  );

  useEffect(() => {
    async function fetchProgress(): Promise<void> {
      setLoading(true);

      try {
        const response = await axios.get(
          `${environment.backendApiUrl}/user-progress/units/${user?.id}`,
          { withCredentials: true }
        );

        const parsedResponse = CurrentChapterSchema.safeParse(
          response.data.data
        );
        if (parsedResponse.success) {
          setCurrentChapter(parsedResponse.data);
          setLoading(false);
          return;
        }

        Sentry.captureException(parsedResponse.error, {
          extra: {
            context: "Dashboard",
            action: "fetchProgress",
            zodParseError: parsedResponse.error.issues,
          },
        });
        setLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.status === 404) {
            setNoUnits(true);
          }
        }

        Sentry.captureException(error, {
          extra: {
            context: "Dashboard",
            action: "fetchProgress",
            error,
          },
        });
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user?.id, setCurrentChapter]);

  return (
    <>
      {loading ? (
        <div className={styles.loaderWindow}>
          <div className={styles.loaderGrid}>
            <div className={styles.unitLoaderContainer}>
              <div className={styles.unitLoader}>
                <div className={styles.imgLoader}></div>
              </div>
              <div className={styles.unitLoader}>
                <div className={styles.imgLoader}></div>
              </div>
              <div className={styles.unitLoader}>
                <div className={styles.imgLoader}></div>
              </div>
            </div>
            <div className={styles.contentLoaderContainer}>
              <div className={styles.contentLoader}></div>
              <div className={styles.contentLoader}></div>
              <div className={styles.contentLoader}></div>
              <div className={styles.contentLoader}></div>
              <div className={styles.contentLoader}></div>
            </div>
          </div>
        </div>
      ) : noUnits ? (
        <p>Não há unidades para mostrar </p>
      ) : (
        <div className={styles.mainContent}>
          <div className={styles.unitContainer}>
            {units?.map((unit) => {
              const totalContents: number = unit.contents.length;
              const progress: number = unit.contents.reduce((acc, content) => {
                if (content.contentProgress.status === "COMPLETED") {
                  return acc + 1;
                }
                return acc;
              }, 0);

              const totalProgress: number = (progress / totalContents) * 100;

              return (
                <UnitCard
                  key={unit.id}
                  title={unit.name}
                  description={unit.description}
                  totalContents={unit.contents.length}
                  imgUrl={unit.imageUrl}
                  isActive={clickedCard === unit.name}
                  isLocked={unit.unitProgress.status === "LOCKED"}
                  currentProgress={totalProgress > 0 ? totalProgress : 0}
                  handleClick={handleCardClick}
                />
              );
            })}
          </div>
          <div
            className={`${styles.contentContainer} ${selectedUnit ? styles.show : null}`}
          >
            <h2 className={styles.contentCardTitle}>Conteúdo</h2>
            {selectedUnit && selectedUnit.contents?.length ? (
              selectedUnit.contents.map((content) => {
                const contentMap: Record<
                  ContentType,
                  {
                    id: string;
                    title: string;
                    description: string;
                    isTest?: boolean;
                  } | null
                > = {
                  QUIZ: content.quiz,
                  VIDEO: content.video,
                  SLIDESHOW: content.slideshow,
                  TEST: content.quiz,
                };

                const currentContent = contentMap[content.contentType];

                return (
                  <ContentCard
                    key={content.id}
                    contentId={content.id}
                    contentType={content.contentType}
                    interactiveContentId={`${currentContent?.id}`}
                    title={currentContent?.title ?? ""}
                    description={currentContent?.description ?? ""}
                    isLocked={content.contentProgress.status === "LOCKED"}
                    isCompleted={content.contentProgress.status === "COMPLETED"}
                  />
                );
              })
            ) : (
              <p className={styles.noContentMessage}>
                Não há conteúdo para exibir...
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
