import { type ReactElement } from "react";
import styles from "./styles/UnscrambleOption.module.scss";
import type UnscrambleOptionProps from "./UnscrambleOption.types";

export default function UnscrambleOption({
  label,
}: UnscrambleOptionProps): ReactElement {
  return (
    <>
      <p className={styles.option}>{label}</p>
    </>
  );
}
