import type { ReactElement } from "react";
import styles from "./styles/Dashboard.module.scss";

export default function Dashboard(): ReactElement {
  return (
    <>
      <h1 className={styles.title}>DASHBOARD</h1>
    </>
  );
}
