import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/Hub.module.scss";
import UserMenu from "../../components/userMenu/UserMenu";
import { useUserProgressStore } from "../../stores/userProgressStore";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ContentCard from "../../components/contentCard/ContentCard";
import { useCurrentChapterStore } from "../../stores/currentChapterStore";
import type { Unit } from "../../schemas/unit.schema";

export default function Hub(): ReactElement {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryId = searchParams.get("id");
  const imgUrl = useUserProgressStore(
    (state) => state.data?.currentChapter.chapter.imageUrl
  );
  const currentChapter = useCurrentChapterStore((state) => state.data);
  const [contentUnit, setContentUnit] = useState<Unit | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (!queryId) {
      navigate("/dashboard", { replace: true });
    }
  }, [queryId, navigate]);

  useEffect(() => {
    if (queryId) {
      const currentUnit: Unit | undefined = currentChapter?.units.find((unit) =>
        unit.contents.find((content) => {
          const ids = [
            content.quiz?.id,
            content.slideshow?.id,
            content.video?.id,
          ];

          return ids.includes(queryId ?? null);
        })
      );
      setContentUnit(currentUnit);
    }
  }, [queryId, currentChapter]);

  return (
    <>
      <div className={styles.window}>
        <div className={styles.header}>
          <div className={styles.index} onClick={() => navigate("/dashboard")}>
            <img className={styles.logo} src="/logo.png" />
          </div>
          <div className={styles.heading}>
            <div className={styles.picture}>
              <img className={styles.img} src={imgUrl} />
            </div>
            <h2 className={styles.unitName}>
              Unidade {contentUnit?.order}: <strong>{contentUnit?.name}</strong>{" "}
            </h2>
          </div>
          <div className={styles.userMenuContainer}>
            <UserMenu />
          </div>
        </div>
        <div className={styles.splitScreen}>
          <div className={styles.mainContent}>
            <div className={styles.content}>
              <Outlet />
            </div>
          </div>
          <aside className={styles.contentMenu}>
            <h2 className={styles.contentCardTitle}>Conteúdos</h2>
            {contentUnit && contentUnit.contents?.length > 0 ? (
              contentUnit.contents.map((content) => {
                const contentMap: Record<
                  string,
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
          </aside>
        </div>
      </div>
    </>
  );
}
