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
      setElapsedTime(time);
      navigate(`/completed-quiz?id=${quizId}`, { replace: true });
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
  const setQuiz = useActiveQuizStore((state) => state.setQuiz);
  const setElapsedTime = useActiveQuizStore((state) => state.setElapsedTime);
  const userAnswer = useQuizAnswerStore();
  const prepareAnswers = useQuizAnswerStore((state) => state.prepareAnswers);
  const [movingForward, setMovingForward] = useState<boolean>(false);
  const [movingBackwards, setMovingBackwards] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [isTest, setIsTest] = useState<boolean>(false);
  const testMaxDuration: number = 1000 * 60 * 30; //test time limit in miliseconds (miliseconds * seconds * desired minutes)
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);

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
          setQuiz(parsedResponse.data);
          setExercises(parsedResponse.data.exercises);
          prepareAnswers(parsedResponse.data.exercises);
          if (parsedResponse.data.isTest) {
            setIsTest(true);
            setShowInstructions(true);
          }
          setLoading(false);
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
  }, [setExercises, prepareAnswers, quizId, resetQuiz, setQuiz]);

  useEffect(() => {
    if (!start) return;

    const interval = setInterval(() => setTime((time) => time + 1000), 1000);

    if (isTest && time >= testMaxDuration) {
      setElapsedTime(time);
      navigate(`/completed-quiz?id=${quizId}`, { replace: true });
    }

    return () => clearInterval(interval);
  }, [time, setElapsedTime, quizId, navigate, isTest, testMaxDuration, start]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : showInstructions ? (
        <div className={styles.testWindow}>
          <div className={styles.decorativeLine}></div>
          <div className={styles.testMainContent}>
            <h1 className={styles.testTitle}>TESTE</h1>
            <div className={styles.testWrapper}>
              <div className={styles.testInfoContainer}>
                <h2 className={styles.title2}>Antes de começar</h2>
                <ul>
                  <li>
                    Você tem {testMaxDuration / 60000} minutos para concluir
                  </li>
                  <li>O progresso só é salvo ao final do teste</li>
                  <li>Todas as questões valem 1 ponto</li>
                  <li>
                    Você precisa acertar ao menos 60% das questões para passar
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setShowInstructions(false);
                  setStart(true);
                }}
                className={styles.testStart}
              >
                Iniciar
              </button>
            </div>
          </div>
        </div>
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
            {isTest ? (
              <div className={styles.clock}>
                <div className={styles.clockIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={26}
                    height={26}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clock-icon lucide-clock"
                  >
                    <path d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <p className={styles.clockValues}>
                  {Math.floor(time / 60000)
                    .toString()
                    .padStart(2, "0")}{" "}
                  :{" "}
                  {Math.floor((time / 1000) % 60)
                    .toString()
                    .padStart(2, "0")}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
