import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/CompletedQuiz.module.scss";
import MetricsCard from "../../components/metricsCard/MetricsCard";
import { useActiveQuizStore } from "../../stores/activeQuizStore";
import type { Exercise } from "../../schemas/exercise.schema";
import { useQuizAnswerStore, type Answer } from "../../stores/quizAnswerStore";
import _ from "lodash";
import { Link, useLocation, useNavigate } from "react-router-dom";
import completeContent from "../../helper/functions/completeContent";
import {
  useCurrentChapterStore,
  type CurrentChapterStoreState,
} from "../../stores/currentChapterStore";
import type { Content } from "../../schemas/content.schema";
import type { CurrentChapter } from "../../schemas/currentChapter.schema";
import type { Unit } from "../../schemas/unit.schema";
import * as Sentry from "@sentry/react";
import { toast } from "react-toastify";
import { toastMessages } from "../../helper/messages/toastMessages";
import type ExerciseProgress from "../../helper/types/ExerciseProgress";
import type QuizProgress from "../../helper/types/QuizProgress";
import { useUserStore } from "../../stores/userStore";
import axios from "axios";
import { environment } from "../../environment/environment";
import { isEqual } from "lodash";
import type { Quiz } from "../../schemas/quiz.schema";

export default function CompletedQuiz(): ReactElement {
  async function saveQuizProgress(): Promise<void> {
    try {
      const exerciseAnswers: ExerciseProgress[] = Object.values(answers).map(
        (answer) => {
          const question: Exercise | undefined = questions.find(
            (question) => question.id === answer.exerciseId
          );

          return {
            exerciseId: answer.exerciseId,
            selectedAnswers: answer.answer,
            elapsedTime: answer.elapsedTime,
            isCorrectAnswer: question
              ? isEqual(
                  answer.answer.map((answer) => answer.toLowerCase()),
                  question.correctAnswer.map((question) =>
                    question.toLowerCase()
                  )
                )
              : false,
          };
        }
      );

      const answeredQuiz: QuizProgress = {
        userId: user?.id,
        quizId,
        answers: exerciseAnswers,
        score: Math.floor((totalCorrectAnswers / questions.length) * 100),
        elapsedTime,
        userContentId: activeContent?.contentProgress.id,
        isTest: quiz?.isTest ?? false,
        isPassed,
      };

      await axios.post(
        `${environment.backendApiUrl}/answers/q/complete`,
        answeredQuiz,
        { withCredentials: true }
      );
    } catch (error) {
      toast.error(toastMessages.content.error, { autoClose: 3000 });

      Sentry.captureException(error, {
        extra: {
          context: "CompletedQuiz",
          action: "saveQuizProgress",
          error,
        },
      });
    }
  }

  async function finishQuiz(): Promise<void> {
    try {
      setIsSaving(true);
      await saveQuizProgress();
      if (activeContent && quizId) {
        await completeContent(
          activeContent.id,
          activeContent.contentProgress.id,
          quizId,
          "QUIZ",
          navigate,
          currentChapterStore
        );
      }
      setIsSaving(false);
    } catch (error) {
      toast.error(toastMessages.content.error, { autoClose: 3000 });

      Sentry.captureException(error, {
        extra: {
          context: "CompletedQuiz",
          action: "finishQuiz",
          error,
        },
      });
    }
  }

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quizId = searchParams.get("id");
  const questions: Exercise[] = useActiveQuizStore((state) => state.exercises);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState<number>(0);
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [tryAgain, setTryAgain] = useState<boolean>(false);
  const user = useUserStore((state) => state.data);
  const answers: Record<number, Answer> = useQuizAnswerStore(
    (state) => state.answers
  );
  const elapsedTime: number = useActiveQuizStore((state) => state.elapsedTime);
  const quiz: Quiz | null = useActiveQuizStore((state) => state.quiz);
  const currentChapter: CurrentChapter | null = useCurrentChapterStore(
    (state) => state.data
  );

  const currentChapterStore: CurrentChapterStoreState =
    useCurrentChapterStore();

  const activeUnit: Unit | undefined = currentChapter?.units.find((unit) =>
    unit.contents.some((content) => {
      const ids = [content.video?.id, content.slideshow?.id, content.quiz?.id];
      return ids.includes(quizId ?? "");
    })
  );
  const activeContent: Content | undefined = activeUnit?.contents.find(
    (content) => content?.quiz?.id === quizId
  );

  const [isReady, setIsReady] = useState<boolean>(false);
  const [saving, setIsSaving] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!quizId) {
      navigate("/");
    }
  }, [quizId, navigate]);

  useEffect(() => {
    if (questions.length === 0) {
      navigate("/dashboard", { replace: true });
    }

    const total: number = questions.reduce(
      (acc: number, question: Exercise) => {
        const userAnswer = answers[question.id];

        if (
          userAnswer &&
          _.isEqual(
            userAnswer.answer.map((answer) => answer.toLowerCase()),
            question.correctAnswer.map((answer) => answer.toLowerCase())
          )
        ) {
          return acc + 1;
        }

        return acc;
      },
      0
    );

    const passed: boolean = (total / questions.length) * 100 >= 60;
    setTotalCorrectAnswers(total);
    setIsPassed(passed);
    if (quiz?.isTest) setTryAgain(!passed);
    setIsReady(true);
  }, [answers, questions, navigate, quiz?.isTest]);

  return (
    <>
      {!isReady ? (
        <p>LOADING...</p>
      ) : (
        <div className={styles.screen}>
          <div className={styles.decorativeLine}></div>
          <div className={styles.mainContainer}>
            <h1 className={styles.title}>
              {tryAgain
                ? "Você não passou!"
                : quiz?.isTest
                  ? "Teste finalizado"
                  : "Quiz finalizado!"}
            </h1>
            <div className={styles.metricsWrapper}>
              <MetricsCard
                value={`${questions.length}`}
                label="Total de perguntas"
              />
              <MetricsCard
                value={`${Math.floor((totalCorrectAnswers / questions.length) * 100)}%`}
                label="Porcentagem"
              />
              <MetricsCard
                value={`${totalCorrectAnswers}`}
                label="Respostas corretas"
              />
              <MetricsCard
                value={`${Math.floor(elapsedTime / 1000 / 60)
                  .toString()
                  .padStart(
                    2,
                    "0"
                  )}:${((elapsedTime / 1000) % 60).toString().padStart(2, "0")}`}
                label="Tempo"
              />
            </div>
            {tryAgain ? (
              <div className={styles.btnWrapper}>
                <Link to={"/"}>
                  <button className={`${styles.btn}`}>
                    Voltar para a página inicial
                  </button>
                </Link>
                <Link to={`/quiz?id=${quizId}`}>
                  <button className={styles.btn}>Tentar de novo</button>
                </Link>
              </div>
            ) : (
              <div className={styles.btnWrapper}>
                {quiz?.isTest ? (
                  <button
                    className={`${styles.btn} ${quiz?.isTest ? styles.inactiveBtn : null}`}
                  >
                    Ver respostas
                  </button>
                ) : (
                  <button
                    className={`${styles.btn} ${quiz?.isTest ? styles.inactiveBtn : null}`}
                    onClick={() => navigate(`/quiz-results?id=${quizId}`)}
                  >
                    Ver respostas
                  </button>
                )}
                <button
                  className={`${styles.btn} ${saving ? styles.saving : null}`}
                  onClick={() => finishQuiz()}
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
