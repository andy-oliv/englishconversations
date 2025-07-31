import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/QuizResults.module.scss";
import type { Exercise } from "../../schemas/exercise.schema";
import { useActiveQuizStore } from "../../stores/activeQuizStore";
import { useQuizAnswerStore, type Answer } from "../../stores/quizAnswerStore";
import _ from "lodash";

export default function QuizResults(): ReactElement {
  const navigate = useNavigate();
  const questions: Exercise[] = useActiveQuizStore((state) => state.exercises);
  const answers: Record<number, Answer> = useQuizAnswerStore(
    (state) => state.answers
  );

  return (
    <>
      <div className={styles.screen}>
        <div className={styles.decorativeLine}></div>
        <div className={styles.mainContainer}>
          <h1 className={styles.title}>Respostas do quiz</h1>
          <div className={styles.answerContainer}>
            {questions
              ? questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`${styles.answer} ${_.isEqual(question.correctAnswer, answers[question.id].answer) ? styles.rightAnswer : styles.wrongAnswer}`}
                  >
                    <p className={styles.questionNumber}>
                      Question {index + 1}
                    </p>
                    <h2 className={styles.questionType}>
                      {question.type.replaceAll("_", " ")}
                    </h2>
                    <p className={styles.description}>{question.description}</p>
                    <div className={styles.answerWrapper}>
                      <div className={styles.answerBlock}>
                        <h3 className={styles.subtitle}>Resposta correta</h3>
                        <p className={styles.correctAnswer}>
                          {question.correctAnswer}
                        </p>
                      </div>
                      <div className={styles.answerBlock}>
                        <h3 className={styles.subtitle}>Sua resposta</h3>
                        <p className={`${styles.userAnswer}`}>
                          {answers[question.id].answer.length === 0
                            ? "Não respondeu"
                            : answers[question.id].answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className={styles.btnWrapper}>
            <button className={styles.btn} onClick={() => navigate(-1)}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
