import { type ReactElement } from "react";
import styles from "./styles/FreeAnswerQuestion.module.scss";
import type ExerciseComponentProps from "../ExerciseComponent.types";
import { useActiveQuizStore } from "../../../stores/activeQuizStore";
import { useQuizAnswerStore } from "../../../stores/quizAnswerStore";
import QuestionNumber from "../../questionNumber/QuestionNumber";

export default function FreeAnswerQuestion({
  exercise,
}: ExerciseComponentProps): ReactElement {
  function inputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setAnswer(exercise.id, [event.target.value], true, 0);
  }

  const { currentExerciseIndex } = useActiveQuizStore();
  const setAnswer = useQuizAnswerStore((state) => state.setAnswer);
  const getAnswer = useQuizAnswerStore((state) => state.getAnswer);

  return (
    <>
      <QuestionNumber number={currentExerciseIndex + 1} />
      <h1 className={styles.title}>Free answer question</h1>
      <p className={styles.description}>{exercise.description}</p>
      <div className={styles.optionContainer}>
        <input
          placeholder="Type your answer"
          type="text"
          id="text"
          name="text"
          className={styles.inputText}
          defaultValue={
            getAnswer(exercise.id)?.answer?.[0] != null
              ? getAnswer(exercise.id).answer[0].toString()
              : ""
          }
          onChange={(event) => inputChange(event)}
        />
      </div>
    </>
  );
}
