import type { ReactElement } from "react";
import styles from "./styles/QuizFreeInput.module.scss";
import type QuizFreeInputProps from "./QuizFreeInput.types";

export default function QuizFreeInput({
  defaultValue,
  onChange,
}: QuizFreeInputProps): ReactElement {
  return (
    <>
      <input
        type="text"
        name="textInput"
        id="text"
        className={styles.textInput}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        placeholder="Type your answer here"
        defaultValue={defaultValue}
      />
    </>
  );
}
