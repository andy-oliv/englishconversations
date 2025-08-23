import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/Dashboard.module.scss";
import axios, { AxiosError } from "axios";
import { environment } from "../../environment/environment";
import { UserStore } from "../../stores/userStore";
import {
  type UnitProgress,
  UnitProgressSchemas,
} from "../../schemas/unitProgress.schema";
import * as Sentry from "@sentry/react";
import UnitCard from "../../components/unitCard/UnitCard";
import ContentCard from "../../components/contentCard/ContentCard";
import { useUnitProgressesStore } from "../../stores/unitProgressesStore";
import { useCurrentUnitStore } from "../../stores/currentUnitStore";
import type { ContentType } from "../../components/contentCard/ContentCard.types";

export default function Dashboard(): ReactElement {
  function handleCardClick(title: string): void {
    setClickedCard(title);
    if (units) {
      const unit: UnitProgress = units.find((unit) => unit.name === title)!;
      setSelectedUnit(unit);
      setCurrentUnit({
        id: unit.id,
        title: unit.name,
        description: unit.description,
        unitNumber: unit.order,
        contents: unit.contents,
      });
      sessionStorage.setItem(
        "currentUnit",
        JSON.stringify({
          id: unit.id,
          title: unit.name,
          description: unit.description,
          unitNumber: unit.order,
          contents: unit.contents,
        })
      );
    }
  }

  const user = UserStore((state) => state.data);
  const setData = useUnitProgressesStore((state) => state.setData);
  const units = useUnitProgressesStore((state) => state.data);
  const setCurrentUnit = useCurrentUnitStore((state) => state.setUnit);
  const [loading, setLoading] = useState<boolean>(false);
  const [clickedCard, setClickedCard] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitProgress | null>(null);
  const [noUnits, setNoUnits] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProgress(): Promise<void> {
      setLoading(true);
      const cache = sessionStorage.getItem("unitProgresses");
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
        const parsedResponse = UnitProgressSchemas.safeParse(
          response.data.data.units
        );
        if (parsedResponse.success) {
          setData(parsedResponse.data);
          sessionStorage.setItem(
            "unitProgresses",
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
      ) : noUnits ? (
        <p>Não há unidades para mostrar </p>
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
                isLocked={unit.unitProgress.status === "LOCKED"}
                handleClick={handleCardClick}
              />
            ))}
          </div>
          <div
            className={`${styles.contentContainer} ${selectedUnit ? styles.show : null}`}
          >
            <h2 className={styles.contentCardTitle}>Conteúdo</h2>
            {selectedUnit && selectedUnit.contents?.length > 0 ? (
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
                    id={content.id}
                    contentType={content.contentType}
                    contentId={`${currentContent?.id}`}
                    userContentId={content.contentProgress.id}
                    title={currentContent?.title ?? ""}
                    description={currentContent?.description ?? ""}
                    isLocked={content.contentProgress.status === "LOCKED"}
                    isFavorite={content.contentProgress.isFavorite ?? false}
                    notes={content.contentProgress.notes ?? ""}
                    isComplete={content.contentProgress.status === "COMPLETED"}
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
