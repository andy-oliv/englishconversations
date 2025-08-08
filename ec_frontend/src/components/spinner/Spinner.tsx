import type { ReactElement } from "react";
import styles from "./styles/Spinner.module.scss";

export default function Spinner(): ReactElement {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}></div>
    </div>
  );
}
