import type { ReactElement } from "react";
import styles from "./styles/ContentCard.module.scss";
import type ContentCardProps from "./ContentCard.types";
import { icons } from "./icons";

export default function ContentCard({
  title,
  description,
  contentType,
}: ContentCardProps): ReactElement {
  const cardStyle: Record<string, unknown> = {
    VIDEO: styles.video,
    QUIZ: styles.quiz,
    TEST: styles.test,
    SLIDESHOW: styles.slideshow,
  };

  return (
    <>
      <div className={`${styles.card} ${cardStyle[contentType]}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.icon}>{icons[contentType]}</div>
        </div>

        <p className={styles.description}>{description}</p>
      </div>
    </>
  );
}
