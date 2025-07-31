import { useState, type ReactElement } from "react";
import styles from "./styles/CorrectOrIncorrect.module.scss";
import { useActiveQuizStore } from "../../../stores/activeQuizStore";
import { useQuizAnswerStore } from "../../../stores/quizAnswerStore";
import type ExerciseComponentProps from "../ExerciseComponent.types";
import QuestionNumber from "../../questionNumber/QuestionNumber";
import CorrectOrIncorrectOption from "../../correctOrIncorrectOption/correctOrIncorrectOption";

export default function CorrectOrIncorrect({
  exercise,
}: ExerciseComponentProps): ReactElement {
  function handleSelection(option: string): void {
    setSelected(option);
    setAnswer(exercise.id, [option], true, 0);
  }

  const { currentExerciseIndex } = useActiveQuizStore();
  const [selected, setSelected] = useState<string>("");
  const { setAnswer, answers } = useQuizAnswerStore();

  return (
    <>
      <QuestionNumber number={currentExerciseIndex + 1} />
      <h1 className={styles.title}>Correct or incorrect</h1>
      <p className={styles.description}>{exercise.description}</p>
      <div className={styles.options}>
        {exercise.options?.map((option) => (
          <CorrectOrIncorrectOption
            key={`${exercise.id}-${option}`}
            label={option}
            isSelected={
              answers[exercise.id].answer.includes(option)
                ? true
                : selected === option
            }
            setSelected={() => handleSelection(option)}
          />
        ))}
      </div>
    </>
  );
}
