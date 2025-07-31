import { type ReactElement } from "react";
import styles from "./styles/CorrectOrIncorrectOption.module.scss";
import type CorrectOrIncorrectOptionProps from "./CorrectOrIncorrectOption.types";

export default function CorrectOrIncorrectOption({
  label,
  isSelected,
  setSelected,
}: CorrectOrIncorrectOptionProps): ReactElement {
  return (
    <>
      <p
        onClick={() => setSelected()}
        className={`${styles.option} ${isSelected ? styles.selected : ""}`}
      >
        {label}
      </p>
    </>
  );
}
