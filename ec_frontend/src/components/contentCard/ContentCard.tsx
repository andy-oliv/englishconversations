import { type ReactElement } from "react";
import styles from "./styles/ContentCard.module.scss";
import type ContentCardProps from "./ContentCard.types";
import { icons } from "./icons";
import { useNavigate } from "react-router-dom";
import type { ContentType } from "./ContentCard.types";
import { useCurrentChapterStore } from "../../stores/currentChapterStore";

export default function ContentCard({
  contentId,
  title,
  description,
  contentType,
  isLocked,
  interactiveContentId,
  isCompleted,
}: ContentCardProps): ReactElement {
  function handleClick() {
    setCurrentContentId(contentId);
    navigate(`${link[contentType]}?id=${interactiveContentId}`);
  }

  const setCurrentContentId = useCurrentChapterStore(
    (state) => state.setCurrentContentId
  );
  const navigate = useNavigate();
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
        {isCompleted ? (
          <div className={styles.completeIcon}>
            <img className={styles.checkMark} src="/checkmark.png" />
          </div>
        ) : null}
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
