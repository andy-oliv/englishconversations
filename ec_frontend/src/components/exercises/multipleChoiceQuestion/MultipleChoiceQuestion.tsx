import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/MultipleChoiceQuestion.module.scss";
import type ExerciseComponentProps from "../ExerciseComponent.types";
import QuizOption from "../../quizOption/QuizOption";
import { useQuizAnswerStore } from "../../../stores/quizAnswerStore";
import QuestionNumber from "../../questionNumber/QuestionNumber";
import { useActiveQuizStore } from "../../../stores/activeQuizStore";

export default function MultipleChoiceQuestion({
  exercise,
}: ExerciseComponentProps): ReactElement {
  function handleSelection(option: string): void {
    setSelected(option);
    setAnswer(exercise.id, [option], true, time);
  }

  const { currentExerciseIndex } = useActiveQuizStore();
  const [selected, setSelected] = useState<string>("");
  const { setAnswer, answers } = useQuizAnswerStore();
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
      <h1 className={styles.title}>Multiple Choice Question</h1>
      <p className={styles.description}>{exercise.description}</p>
      <div className={styles.options}>
        {exercise.options?.map((option) => (
          <QuizOption
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
