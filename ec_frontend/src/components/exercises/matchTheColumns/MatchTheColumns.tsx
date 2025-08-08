import { useEffect, useRef, useState, type ReactElement } from "react";
import styles from "./styles/MatchTheColumns.module.scss";
import type ExerciseComponentProps from "../ExerciseComponent.types";
import { useActiveQuizStore } from "../../../stores/activeQuizStore";
import { useQuizAnswerStore } from "../../../stores/quizAnswerStore";
import QuestionNumber from "../../questionNumber/QuestionNumber";

export default function MatchTheColumns({
  exercise,
}: ExerciseComponentProps): ReactElement {
  function handleSelection(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    answerRef.current[index] = event.target.value;
    setAnswer(exercise.id, [...Object.values(answerRef.current)], true, time);
  }

  const { currentExerciseIndex } = useActiveQuizStore();
  const setAnswer = useQuizAnswerStore((state) => state.setAnswer);
  const getAnswer = useQuizAnswerStore((state) => state.getAnswer);
  const answerRef = useRef<Record<number, string>>({});
  const [answersInStore, setAnswersInStore] = useState<string[]>([]);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    if (getAnswer(exercise.id).isAnswered) {
      setAnswersInStore(getAnswer(exercise.id).answer);
      getAnswer(exercise.id).answer.forEach((answer, index) => {
        answerRef.current[index] = answer;
      });
    }

    const interval = setInterval(() => {
      setTime((time) => time + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [setAnswer, getAnswer, exercise]);

  return (
    <>
      <QuestionNumber number={currentExerciseIndex + 1} />
      <h1 className={styles.title}>Match the columns</h1>
      <p className={styles.description}>{exercise.description}</p>
      <div className={styles.grid}>
        <div className={styles.options}>
          {exercise.columnA?.map((option, index) => (
            <div key={index} className={styles.answerContainer}>
              <p className={styles.option}>{index + 1}.</p>
              <p className={styles.option}>{option}</p>
            </div>
          ))}
        </div>
        <div className={styles.options}>
          {exercise.columnB?.map((option, index) => (
            <div key={index} className={styles.answerContainer}>
              <input
                className={styles.answerInput}
                type="number"
                min={1}
                max={exercise.columnA?.length}
                onKeyDown={(event) => event.preventDefault()}
                onChange={(event) => handleSelection(event, index)}
                defaultValue={
                  answersInStore.length > 0 ? answersInStore[index] : undefined
                }
              />
              <p className={styles.option}>{option}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
