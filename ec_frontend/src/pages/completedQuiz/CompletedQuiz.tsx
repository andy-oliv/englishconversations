import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/CompletedQuiz.module.scss";
import MetricsCard from "../../components/metricsCard/MetricsCard";
import { useActiveQuizStore } from "../../stores/activeQuizStore";
import type { Exercise } from "../../schemas/exercise.schema";
import { useQuizAnswerStore, type Answer } from "../../stores/quizAnswerStore";
import _ from "lodash";
import { Link, useLocation, useNavigate } from "react-router-dom";
import completeContent from "../../helper/functions/completeContent";
import { useCurrentChapterStore } from "../../stores/currentChapterStore";
import type { Content } from "../../schemas/content.schema";
import type { CurrentChapter } from "../../schemas/currentChapter.schema";
import type { Unit } from "../../schemas/unit.schema";

export default function CompletedQuiz(): ReactElement {
  async function saveQuizProgress(): Promise<void> {
    try {
      console.log(answers);
    } catch (error) {
      console.log(error);
    }
  }

  function goNextContent(): void {
    if (activeContent) {
      const currentContentIndex: number | undefined =
        activeUnit?.contents.indexOf(activeContent);
      const nextContent: Content | undefined =
        activeUnit?.contents[currentContentIndex ? currentContentIndex + 1 : 0];

      if (nextContent) {
        const contentType: string = nextContent.contentType.toLowerCase();
        const allowedTypes: Record<string, string | undefined> = {
          video: nextContent.video?.id,
          slideshow: nextContent.slideshow?.id,
          quiz: nextContent.quiz?.id,
          test: nextContent.quiz?.id,
        };
        navigate(`/hub/${contentType}?id=${allowedTypes[contentType]}`, {
          replace: true,
        });

        return;
      }
    }

    if (activeUnit) {
      const currentUnitIndex: number | undefined =
        currentChapter?.units.indexOf(activeUnit);
      const nextUnit: Unit | undefined =
        currentChapter?.units[currentUnitIndex ? currentUnitIndex + 1 : 0];

      if (nextUnit) {
        const firstContent: Content | null = nextUnit.contents[0];
        const contentType: string = firstContent.contentType.toLowerCase();
        const allowedTypes: Record<string, string | undefined> = {
          video: firstContent.video?.id,
          slideshow: firstContent.slideshow?.id,
          quiz: firstContent.quiz?.id,
          test: firstContent.quiz?.id,
        };
        navigate(`/hub/${contentType}?id=${allowedTypes[contentType]}`, {
          replace: true,
        });

        return;
      }
    }

    navigate("/");
  }

  async function finishQuiz(): Promise<void> {
    saveQuizProgress();

    if (activeContent) {
      await completeContent(
        activeContent.id,
        activeContent.contentProgress.id,
        setCurrentChapter,
        getCurrentUnit,
        setCurrentUnitId
      );

      goNextContent();
    }
  }

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quizId = searchParams.get("id");
  const questions: Exercise[] = useActiveQuizStore((state) => state.exercises);
  const elapsedTime: number = useActiveQuizStore((state) => state.elapsedTime);

  const currentChapter: CurrentChapter | null = useCurrentChapterStore(
    (state) => state.data
  );

  const activeUnit: Unit | undefined = currentChapter?.units.find((unit) =>
    unit.contents.some((content) => {
      const ids = [content.video?.id, content.slideshow?.id, content.quiz?.id];
      return ids.includes(quizId ?? "");
    })
  );
  const activeContent: Content | undefined = activeUnit?.contents.find(
    (content) => content?.quiz?.id === quizId
  );

  const setCurrentChapter = useCurrentChapterStore(
    (state) => state.setCurrentChapter
  );

  const getCurrentUnit = useCurrentChapterStore(
    (state) => state.getCurrentUnit
  );
  const setCurrentUnitId = useCurrentChapterStore(
    (state) => state.setCurrentUnitId
  );
  const answers: Record<number, Answer> = useQuizAnswerStore(
    (state) => state.answers
  );
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
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
                  .padStart(
                    2,
                    "0"
                  )}:${((elapsedTime / 1000) % 60).toString().padStart(2, "0")}`}
                label="Tempo"
              />
            </div>
            <div className={styles.btnWrapper}>
              <Link to={`/quiz-results?id=${quizId}`}>
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
