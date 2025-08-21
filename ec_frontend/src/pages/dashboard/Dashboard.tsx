import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/Dashboard.module.scss";
import axios from "axios";
import { environment } from "../../environment/environment";
import { UserStore } from "../../stores/userStore";
import {
  type ChapterProgress,
  ChapterProgressSchemas,
} from "../../schemas/chapterProgress.schema";
import * as Sentry from "@sentry/react";
import { useChapterProgressStore } from "../../stores/chapterProgressStore";
import UnitCard from "../../components/unitCard/UnitCard";
import ContentCard from "../../components/contentCard/ContentCard";

export default function Dashboard(): ReactElement {
  function handleCardClick(title: string): void {
    setClickedCard(title);
    if (units) {
      const unit: ChapterProgress = units.find((unit) => unit.name === title)!;
      setSelectedUnit(unit);
    }
  }

  const user = UserStore((state) => state.data);
  const setData = useChapterProgressStore((state) => state.setData);
  const units = useChapterProgressStore((state) => state.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [clickedCard, setClickedCard] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<ChapterProgress | null>(
    null
  );

  useEffect(() => {
    async function fetchProgress(): Promise<void> {
      setLoading(true);
      const cache = sessionStorage.getItem("chapterProgress");
      if (cache) {
        setData(JSON.parse(cache));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${environment.backendApiUrl}/user-progress/units/${user?.id}`,
          { withCredentials: true }
        );
        const parsedResponse = ChapterProgressSchemas.safeParse(
          response.data.data.progress
        );
        if (parsedResponse.success) {
          setData(parsedResponse.data);
          sessionStorage.setItem(
            "chapterProgress",
            JSON.stringify(parsedResponse.data)
          );
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
  }, [user, setData]);

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
      ) : (
        <div className={styles.mainContent}>
          <div className={styles.unitContainer}>
            {units?.map((unit) => (
              <UnitCard
                key={unit.id}
                title={unit.name}
                description={unit.description}
                totalContents={unit.contents.length}
                imgUrl={unit.imageUrl}
                isActive={clickedCard === unit.name}
                handleClick={handleCardClick}
              />
            ))}
          </div>
          <div
            className={`${styles.contentContainer} ${selectedUnit ? styles.show : null}`}
          >
            <h2 className={styles.contentCardTitle}>Conteúdo</h2>
            {selectedUnit && selectedUnit.contents?.length > 0 ? (
              selectedUnit.contents.map((content) => (
                <ContentCard
                  key={content.id}
                  contentType={content.contentType}
                  title={
                    content.quiz
                      ? content.quiz.title
                      : content.video
                        ? content.video.title
                        : content.slideshow
                          ? content.slideshow.title
                          : ""
                  }
                  description={
                    content.quiz
                      ? content.quiz.description
                      : content.video
                        ? content.video.description
                        : content.slideshow
                          ? content.slideshow.description
                          : ""
                  }
                />
              ))
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
