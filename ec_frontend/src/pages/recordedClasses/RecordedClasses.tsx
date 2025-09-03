import type { ReactElement } from "react";
import styles from "./styles/RecordedClasses.module.scss";

export default function RecordedClasses(): ReactElement {
  return (
    <>
      <h1 className={styles.title}>AULAS GRAVADAS</h1>
    </>
  );
}
