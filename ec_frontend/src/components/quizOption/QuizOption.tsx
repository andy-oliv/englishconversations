import { type ReactElement } from "react";
import styles from "./styles/QuizOption.module.scss";
import type QuizOptionProps from "./QuizOption.types";

export default function QuizOption({
  label,
  isSelected,
  setSelected,
}: QuizOptionProps): ReactElement {
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
