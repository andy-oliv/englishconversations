import { type ReactElement } from "react";
import styles from "./styles/Hub.module.scss";
import UserMenu from "../../components/userMenu/UserMenu";
import { useUserProgressStore } from "../../stores/userProgressStore";
import { useCurrentUnitStore } from "../../stores/currentUnitStore";

export default function Hub(): ReactElement {
  const imgUrl = useUserProgressStore(
    (state) => state.data?.currentChapter.chapter.imageUrl
  );
  const currentUnit = useCurrentUnitStore((state) => state.unit);

  return (
    <>
      <div className={styles.window}>
        <div className={styles.header}>
          <div className={styles.menuIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu-icon lucide-menu"
            >
              <path d="M4 12h16" />
              <path d="M4 18h16" />
              <path d="M4 6h16" />
            </svg>
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
      </div>
    </>
  );
}
