import { useEffect, type ReactElement } from "react";
import styles from "./styles/Hub.module.scss";
import UserMenu from "../../components/userMenu/UserMenu";
import { useUserProgressStore } from "../../stores/userProgressStore";
import { useCurrentUnitStore } from "../../stores/currentUnitStore";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ContentCard from "../../components/contentCard/ContentCard";

export default function Hub(): ReactElement {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryId = searchParams.get("id");
  const imgUrl = useUserProgressStore(
    (state) => state.data?.currentChapter.chapter.imageUrl
  );

  const currentUnit = useCurrentUnitStore((state) => state.unit);
  const navigate = useNavigate();

  useEffect(() => {
    if (!queryId) {
      navigate("/dashboard", { replace: true });
    }
  });

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
              Unidade {currentUnit?.unitNumber}:{" "}
              <strong>{currentUnit?.title}</strong>{" "}
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
            {currentUnit && currentUnit.contents?.length > 0 ? (
              currentUnit.contents.map((content) => {
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
                    id={content.id}
                    contentType={content.contentType}
                    contentId={`${currentContent?.id}`}
                    userContentId={content.contentProgress.id}
                    title={currentContent?.title ?? ""}
                    description={currentContent?.description ?? ""}
                    isLocked={content.contentProgress.status === "LOCKED"}
                    notes={content.contentProgress.notes ?? ""}
                    isFavorite={content.contentProgress.isFavorite ?? false}
                    isComplete={content.contentProgress.status === "COMPLETED"}
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
