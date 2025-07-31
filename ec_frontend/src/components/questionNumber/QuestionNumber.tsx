import type { ReactElement } from "react";
import styles from "./styles/QuestionNumber.module.scss";
import type QuestionNumberProps from "./QuestionNumber.types";

export default function QuestionNumber({
  number,
}: QuestionNumberProps): ReactElement {
  return (
    <>
      <p className={styles.text}>Question {number}</p>
    </>
  );
}
