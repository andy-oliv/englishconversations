import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/CompletedQuiz.module.scss";
import MetricsCard from "../../components/metricsCard/MetricsCard";
import { useActiveQuizStore } from "../../stores/activeQuizStore";
import type { Exercise } from "../../schemas/exercise.schema";
import { useQuizAnswerStore, type Answer } from "../../stores/quizAnswerStore";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import completeContent from "../../helper/functions/completeContent";
import { useCurrentChapterStore } from "../../stores/currentChapterStore";
import type { Content } from "../../schemas/content.schema";

export default function CompletedQuiz(): ReactElement {
  async function saveQuizProgress(): Promise<void> {
    try {
      console.log(answers);
    } catch (error) {
      console.log(error);
    }
  }

  function finishQuiz(): void {
    saveQuizProgress();
    if (currentContent) {
      completeContent(
        currentContent.id,
        currentContent.contentProgress.id,
        setCurrentChapter
      );
    }
    navigate("/", { replace: true });
  }

  const questions: Exercise[] = useActiveQuizStore((state) => state.exercises);
  const elapsedTime: number = useActiveQuizStore((state) => state.elapsedTime);
  const currentContent: Content | null = useCurrentChapterStore((state) =>
    state.getCurrentContent()
  );
  const setCurrentChapter = useCurrentChapterStore(
    (state) => state.setCurrentChapter
  );
  const answers: Record<number, Answer> = useQuizAnswerStore(
    (state) => state.answers
  );
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const navigate = useNavigate();

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
    setTotalCorrectAnswers(total);
    setIsReady(true);
  }, [answers, questions, navigate]);

  return (
    <>
      {!isReady ? (
        <p>LOADING...</p>
      ) : (
        <div className={styles.screen}>
          <div className={styles.decorativeLine}></div>
          <div className={styles.mainContainer}>
            <h1 className={styles.title}>Quiz finalizado!</h1>
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
                  .padStart(2, "0")}:${(elapsedTime / 1000) % 60}`}
                label="Tempo"
              />
            </div>
            <div className={styles.btnWrapper}>
              <Link to="/quiz-results">
                <button className={styles.btn}>Ver respostas</button>
              </Link>
              <button className={styles.btn} onClick={() => finishQuiz()}>
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
