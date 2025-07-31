import { useEffect, type ReactElement } from "react";
import styles from "./styles/Quiz.module.scss";
import { sampleQuiz } from "../../db/sampleQuiz";
import { exerciseComponentMap } from "../../helper/maps/exerciseComponent.map";
import { useNavigate } from "react-router-dom";
import { useActiveQuizStore } from "../../stores/activeQuizStore";
import { useQuizAnswerStore } from "../../stores/quizAnswerStore";

export default function Quiz(): ReactElement {
  function handleForwardClick(): void {
    const nextIndex: number =
      useActiveQuizStore.getState().currentExerciseIndex;

    if (nextIndex === activeQuiz.lastQuestion) {
      navigate("/completed-quiz");
    }
    activeQuiz.increaseCurrentExerciseIndex();
  }

  const activeQuiz = useActiveQuizStore();
  const setExercises = useActiveQuizStore((state) => state.setExercises);
  const userAnswer = useQuizAnswerStore();
  const prepareAnswers = useQuizAnswerStore((state) => state.prepareAnswers);
  const navigate = useNavigate();

  useEffect(() => {
    setExercises(sampleQuiz);
    prepareAnswers(sampleQuiz);
  }, [setExercises, prepareAnswers]);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.paginationWrapper}>
          {activeQuiz.exercises.map((exercise, index) => (
            <div
              className={`${styles.pagination} ${index === activeQuiz.currentExerciseIndex ? styles.activeExercise : ""} ${userAnswer.answers[exercise.id].isAnswered ? styles.completedExercise : ""}`}
              key={exercise.id}
            ></div>
          ))}
        </div>
        <div className={styles.quizContainer}>
          {activeQuiz.exercises.map((exercise, index) => {
            if (index != activeQuiz.currentExerciseIndex) {
              return "";
            } else {
              const ExerciseComponent = exerciseComponentMap[exercise.type];
              if (!ExerciseComponent) {
                return <p>Componente desconhecido {exercise.id}</p>;
              }

              return (
                <ExerciseComponent key={exercise.id} exercise={exercise} />
              );
            }
          })}
          <div className={styles.navBtnWrapper}>
            {activeQuiz.currentExerciseIndex != 0 ? (
              <button
                className={styles.backBtn}
                onClick={() => activeQuiz.decreaseCurrentExerciseIndex()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width={30}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
              </button>
            ) : (
              ""
            )}
            <button
              className={`${styles.forwardBtn} ${activeQuiz.currentExerciseIndex === activeQuiz.lastQuestion ? styles.finishQuiz : ""}`}
              onClick={() => handleForwardClick()}
            >
              {activeQuiz.currentExerciseIndex === activeQuiz.lastQuestion ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width={30}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width={30}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
