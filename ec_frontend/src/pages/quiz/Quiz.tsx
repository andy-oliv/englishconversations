import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/Quiz.module.scss";
import { exerciseComponentMap } from "../../helper/maps/exerciseComponent.map";
import { useLocation, useNavigate } from "react-router-dom";
import { useActiveQuizStore } from "../../stores/activeQuizStore";
import { useQuizAnswerStore } from "../../stores/quizAnswerStore";
import axios, { AxiosError } from "axios";
import { environment } from "../../environment/environment";
import Spinner from "../../components/spinner/Spinner";
import { QuizContentSchema } from "../../schemas/quizContent.schema";
import * as Sentry from "@sentry/react";

export default function Quiz(): ReactElement {
  function handleForwardClick(): void {
    setMovingForward(true);
    setMovingBackwards(false);
    const nextIndex: number =
      useActiveQuizStore.getState().currentExerciseIndex;

    if (nextIndex === activeQuiz.lastQuestion) {
      activeQuiz.setElapsedTime(time);
      navigate("/completed-quiz", { replace: true });
    }
    activeQuiz.increaseCurrentExerciseIndex();
  }

  function handleBackwardsClick(): void {
    setMovingBackwards(true);
    setMovingForward(false);
    activeQuiz.decreaseCurrentExerciseIndex();
  }

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quizId = searchParams.get("id");
  const activeQuiz = useActiveQuizStore();
  const setExercises = useActiveQuizStore((state) => state.setExercises);
  const resetQuiz = useActiveQuizStore((state) => state.reset);
  const userAnswer = useQuizAnswerStore();
  const prepareAnswers = useQuizAnswerStore((state) => state.prepareAnswers);
  const [movingForward, setMovingForward] = useState<boolean>(false);
  const [movingBackwards, setMovingBackwards] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    resetQuiz();
    async function fetchQuiz(): Promise<void> {
      if (!quizId) {
        return;
      }
      try {
        const response = await axios.get(
          `${environment.backendApiUrl}/quizzes/${quizId}`,
          { withCredentials: true }
        );
        const parsedResponse = QuizContentSchema.safeParse(response.data.data);
        if (parsedResponse.success) {
          setExercises(parsedResponse.data.exercises);
          prepareAnswers(parsedResponse.data.exercises);
          setLoading(false);
          console.log(parsedResponse.data.exercises);
          return;
        }

        Sentry.captureException(parsedResponse.error, {
          extra: {
            context: "Quiz",
            action: "fetchQuiz",
            error: parsedResponse.error?.issues,
          },
        });
        setLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          Sentry.captureException(error.message, {
            extra: {
              context: "Quiz",
              action: "fetchQuiz",
              error: error,
            },
          });
        }
        setLoading(false);
      }
    }
    fetchQuiz();
    const interval = setInterval(() => setTime((time) => time + 1000), 1000);

    return () => clearInterval(interval);
  }, [setExercises, prepareAnswers, quizId, resetQuiz]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
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
                  <div
                    key={exercise.id}
                    className={`${styles.quizWrapper} ${movingForward ? styles.animateForward : null} ${movingBackwards ? styles.animateBackwards : null}`}
                  >
                    <ExerciseComponent exercise={exercise} />
                  </div>
                );
              }
            })}

            <div className={styles.navBtnWrapper}>
              {activeQuiz.currentExerciseIndex != 0 ? (
                <button
                  className={styles.btn}
                  onClick={() => handleBackwardsClick()}
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
                className={`${styles.btn} ${activeQuiz.currentExerciseIndex === activeQuiz.lastQuestion ? styles.finishQuiz : ""}`}
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
      )}
    </>
  );
}
