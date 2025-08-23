import type { ReactElement } from "react";
import styles from "./styles/ContentCard.module.scss";
import type ContentCardProps from "./ContentCard.types";
import { icons } from "./icons";
import { useNavigate } from "react-router-dom";
import { useCurrentContentStore } from "../../stores/currentContentStore";
import type { ContentType } from "./ContentCard.types";

export default function ContentCard({
  id,
  title,
  description,
  contentType,
  userContentId,
  contentId,
  isLocked,
  notes,
  isFavorite,
  isComplete,
}: ContentCardProps): ReactElement {
  function handleClick() {
    setCurrentContent({
      id,
      userContentId,
      contentId,
      type: contentType,
      title: title,
      description: description,
      notes,
      isFavorite,
      isComplete,
    });
    sessionStorage.setItem(
      "currentContent",
      JSON.stringify({
        userContentId,
        contentId,
        type: contentType,
        title: title,
        description: description,
      })
    );
    navigate(`${link[contentType]}?id=${contentId}`);
  }

  const navigate = useNavigate();
  const setCurrentContent = useCurrentContentStore((state) => state.setContent);
  const link: Record<ContentType, string> = {
    VIDEO: "/hub/video",
    QUIZ: "/quiz",
    TEST: "/quiz",
    SLIDESHOW: "/hub/slideshow",
  };

  const cardStyle: Record<string, unknown> = {
    VIDEO: styles.video,
    QUIZ: styles.quiz,
    TEST: styles.test,
    SLIDESHOW: styles.slideshow,
  };

  return (
    <>
      <div
        className={`${styles.card} ${cardStyle[contentType]} ${isLocked ? styles.locked : ""} ${isLocked ? styles.lockedBackground : ""}`}
        onClick={() => handleClick()}
      >
        {isLocked ? (
          <div className={styles.lockIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-lock-icon lucide-lock"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        ) : null}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.icon}>{icons[contentType]}</div>
        </div>

        <p className={styles.description}>{description}</p>
      </div>
    </>
  );
}
