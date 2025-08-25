import { useEffect, type ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./styles/QuizResults.module.scss";
import type { Exercise } from "../../schemas/exercise.schema";
import { useActiveQuizStore } from "../../stores/activeQuizStore";
import { useQuizAnswerStore, type Answer } from "../../stores/quizAnswerStore";
import _ from "lodash";

export default function QuizResults(): ReactElement {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quizId = searchParams.get("id");
  const navigate = useNavigate();
  const questions: Exercise[] = useActiveQuizStore((state) => state.exercises);
  const answers: Record<number, Answer> = useQuizAnswerStore(
    (state) => state.answers
  );

  useEffect(() => {
    if (!quizId) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (questions.length === 0) {
      navigate("/dashboard", { replace: true });
    }
  }, [questions, navigate]);

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
                    className={`${styles.answer} ${
                      _.isEqual(
                        question.correctAnswer.map((answer) =>
                          answer.toLowerCase()
                        ),
                        answers[question.id].answer.map((answer) =>
                          answer.toLowerCase()
                        )
                      )
                        ? styles.rightAnswer
                        : styles.wrongAnswer
                    }`}
                  >
                    <div className={styles.heading}>
                      <p className={styles.questionNumber}>
                        Question {index + 1}
                      </p>
                      <div className={styles.iconContainer}>
                        <div className={styles.icon}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-clock4-icon lucide-clock-4"
                          >
                            <path d="M12 6v6l4 2" />
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        </div>
                        <p className={styles.time}>
                          {answers[question.id].elapsedTime / 1000}{" "}
                          {answers[question.id].elapsedTime / 1000 > 1
                            ? "segundos"
                            : "segundo"}
                        </p>
                      </div>
                    </div>
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
