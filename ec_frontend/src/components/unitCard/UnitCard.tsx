import { type ReactElement } from "react";
import styles from "./styles/UnitCard.module.scss";
import type UnitCardProps from "./UnitCard.types";

export default function UnitCard({
  title,
  description,
  totalContents,
  imgUrl,
  isActive,
  handleClick,
}: UnitCardProps): ReactElement {
  return (
    <>
      <div
        className={`${styles.card} ${isActive ? styles.active : null}`}
        onClick={() => handleClick(title)}
      >
        <div className={styles.picture}>
          <img className={styles.cardImg} src={imgUrl} />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.totalContents}>
              <p className={styles.contentValue}>{totalContents}</p>
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
                  />
                </svg>
              </div>
            </div>
          </div>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </>
  );
}
