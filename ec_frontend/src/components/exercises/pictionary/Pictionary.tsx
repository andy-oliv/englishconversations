import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/Pictionary.module.scss";
import type ExerciseComponentProps from "../ExerciseComponent.types";
import { useQuizAnswerStore } from "../../../stores/quizAnswerStore";
import QuizOption from "../../quizOption/QuizOption";
import { useActiveQuizStore } from "../../../stores/activeQuizStore";
import QuestionNumber from "../../questionNumber/QuestionNumber";
import QuizFreeInput from "../../quizFreeInput/QuizFreeInput";

export default function Pictionary({
  exercise,
}: ExerciseComponentProps): ReactElement {
  function handleSelection(option: string): void {
    setSelection(option);
    setAnswer(exercise.id, [option], true, time);
  }

  function inputChange(inputValue: string): void {
    setAnswer(exercise.id, [inputValue], true, time);
  }

  const { currentExerciseIndex } = useActiveQuizStore();
  const [selection, setSelection] = useState<string>("");
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
      <h1 className={styles.title}>Pictionary</h1>
      <p className={styles.description}>{exercise.description}</p>
      <div className={styles.grid}>
        <picture>
          <img
            src={exercise.contentUrl ? exercise.contentUrl : ""}
            className={styles.pictionaryImg}
          />
        </picture>
        <div className={styles.optionContainer}>
          {exercise.difficulty === "HARD" ? (
            <QuizFreeInput
              onChange={inputChange}
              defaultValue={
                getAnswer(exercise.id)?.answer?.[0] != null
                  ? getAnswer(exercise.id).answer[0].toString()
                  : ""
              }
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
      </div>
    </>
  );
}
