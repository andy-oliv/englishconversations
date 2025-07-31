import { useState, type ReactElement } from "react";
import styles from "./styles/Translation.module.scss";
import type ExerciseComponentProps from "../ExerciseComponent.types";
import { useActiveQuizStore } from "../../../stores/activeQuizStore";
import { useQuizAnswerStore } from "../../../stores/quizAnswerStore";
import QuestionNumber from "../../questionNumber/QuestionNumber";
import QuizOption from "../../quizOption/QuizOption";

export default function Translation({
  exercise,
}: ExerciseComponentProps): ReactElement {
  function handleSelection(option: string): void {
    setSelection(option);
    setAnswer(exercise.id, [option], true, 0);
  }

  function inputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setAnswer(exercise.id, [event.target.value], true, 0);
  }

  const { currentExerciseIndex } = useActiveQuizStore();

  const setAnswer = useQuizAnswerStore((state) => state.setAnswer);
  const getAnswer = useQuizAnswerStore((state) => state.getAnswer);
  const [selection, setSelection] = useState<string>(
    getAnswer(exercise.id)?.answer?.[0]
      ? getAnswer(exercise.id)?.answer?.[0]
      : ""
  );

  return (
    <>
      <QuestionNumber number={currentExerciseIndex + 1} />
      <h1 className={styles.title}>Translation</h1>
      <p className={styles.description}>{exercise.description}</p>
      <div className={styles.optionContainer}>
        {exercise.difficulty === "HARD" ? (
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
        ) : (
          exercise.options?.map((option, index) => (
            <QuizOption
              key={index}
              label={option}
              isSelected={selection === option}
              setSelected={() => handleSelection(option)}
            />
          ))
        )}
      </div>
    </>
  );
}
