import type { ReactElement } from "react";
import styles from "./styles/Pictionary.module.scss";

export default function Pictionary(): ReactElement {
  return (
    <>
      <h1 className={styles.title}>PICTIONARY</h1>
    </>
  );
}
