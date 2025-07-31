import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/CompletedQuiz.module.scss";
import MetricsCard from "../../components/metricsCard/MetricsCard";
import { useActiveQuizStore } from "../../stores/activeQuizStore";
import type { Exercise } from "../../schemas/exercise.schema";
import { useQuizAnswerStore, type Answer } from "../../stores/quizAnswerStore";
import _ from "lodash";
import { Link } from "react-router-dom";

export default function CompletedQuiz(): ReactElement {
  const questions: Exercise[] = useActiveQuizStore((state) => state.exercises);
  const answers: Record<number, Answer> = useQuizAnswerStore(
    (state) => state.answers
  );
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const total: number = questions.reduce(
      (acc: number, question: Exercise) => {
        const userAnswer = answers[question.id];

        if (
          userAnswer &&
          _.isEqual(userAnswer.answer, question.correctAnswer)
        ) {
          return acc + 1;
        }

        return acc;
      },
      0
    );
    setTotalCorrectAnswers(total);
    setIsReady(true);
  }, [answers, questions]);

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
                value={`${(totalCorrectAnswers / questions.length) * 100}%`}
                label="Porcentagem"
              />
              <MetricsCard
                value={`${totalCorrectAnswers}`}
                label="Respostas corretas"
              />
            </div>
            <div className={styles.btnWrapper}>
              <Link to="/quiz-results">
                <button className={styles.btn}>Ver respostas</button>
              </Link>
              <Link to={"/"}>
                <button className={styles.btn}>Finalizar</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
