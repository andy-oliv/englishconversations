import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/FreeAnswerQuestion.module.scss";
import type ExerciseComponentProps from "../ExerciseComponent.types";
import { useActiveQuizStore } from "../../../stores/activeQuizStore";
import { useQuizAnswerStore } from "../../../stores/quizAnswerStore";
import QuestionNumber from "../../questionNumber/QuestionNumber";
import QuizFreeInput from "../../quizFreeInput/QuizFreeInput";

export default function FreeAnswerQuestion({
  exercise,
}: ExerciseComponentProps): ReactElement {
  function inputChange(input: string): void {
    setAnswer(exercise.id, [input], true, time);
  }

  const { currentExerciseIndex } = useActiveQuizStore();
  const setAnswer = useQuizAnswerStore((state) => state.setAnswer);
  const getAnswer = useQuizAnswerStore((state) => state.getAnswer);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => time + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <QuestionNumber number={currentExerciseIndex + 1} />
      <h1 className={styles.title}>Free answer question</h1>
      <p className={styles.description}>{exercise.description}</p>
      <div className={styles.optionContainer}>
        <QuizFreeInput
          defaultValue={
            getAnswer(exercise.id)?.answer?.[0] !== null
              ? getAnswer(exercise.id)?.answer?.[0]
              : ""
          }
          onChange={inputChange}
        />
      </div>
    </>
  );
}
