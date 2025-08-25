import { useRef, useState, type ReactElement } from "react";
import styles from "./styles/ContentDescription.module.scss";
import type ContentDescriptionProps from "./ContentDescription.types";
import saveFavorite from "../../helper/functions/saveFavorite";
import saveNotes from "../../helper/functions/saveNotes";
import type { ContentType } from "../contentCard/ContentCard.types";
import { useCurrentChapterStore } from "../../stores/currentChapterStore";
import completeContent from "../../helper/functions/completeContent";

export default function ContentDescription({
  content,
  contentType,
  videoDuration,
}: ContentDescriptionProps): ReactElement {
  async function complete(): Promise<void> {
    setSaving(true);
    await completeContent(
      content?.id ?? null,
      content?.contentProgress.id ?? null,
      setCurrentChapter,
      getCurrentUnit,
      setCurrentUnitId,
      contentType === "VIDEO"
        ? {
            isFavorite,
            notes,
            videoId: content?.video?.id,
          }
        : {
            isFavorite,
            notes,
            slideshowId: content?.slideshow?.id,
          }
    );
    setSaving(false);
  }

  async function saveFavorites(): Promise<void> {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    if (content && notesRef.current) {
      await saveFavorite(
        content?.id ?? null,
        content?.contentProgress.id ?? null,
        setCurrentChapter,
        newFavorite
      );
    }
  }

  async function saveNote(): Promise<void> {
    setNotes(notesRef.current ? notesRef.current.value : "");
    if (content && notesRef.current) {
      await saveNotes(
        content?.id ?? null,
        content?.contentProgress.id ?? null,
        setCurrentChapter,
        notesRef.current.value
      );
    }
    setOpenNotes(false);
  }

  const [saving, setSaving] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(
    (content && content.contentProgress?.isFavorite) ?? false
  );
  const [notes, setNotes] = useState<string>(
    (content && content.contentProgress.notes) ?? ""
  );
  const [openNotes, setOpenNotes] = useState<boolean>(false);
  const notesRef = useRef<HTMLTextAreaElement | null>(null);
  const setCurrentChapter = useCurrentChapterStore(
    (state) => state.setCurrentChapter
  );
  const getCurrentUnit = useCurrentChapterStore(
    (state) => state.getCurrentUnit
  );
  const setCurrentUnitId = useCurrentChapterStore(
    (state) => state.setCurrentUnitId
  );

  const allowedContents: Record<
    ContentType,
    {
      id: string;
      title: string;
      description: string;
      isTest?: boolean;
    } | null
  > = {
    QUIZ: content?.quiz ?? null,
    VIDEO: content?.video ?? null,
    TEST: content?.quiz ?? null,
    SLIDESHOW: content?.slideshow ?? null,
  };

  return (
    <>
      <div className={styles.info}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.contentTitle}>
            {allowedContents[contentType]?.title}
          </h2>
          <div className={styles.icons}>
            <div className={styles.icon} onClick={() => saveFavorites()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={34}
                height={34}
                viewBox="0 0 24 24"
                fill={isFavorite ? "#000000" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bookmark-icon lucide-bookmark"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </div>
            <div className={styles.notesContainer}>
              <div
                className={`${styles.notesWrapper} ${openNotes ? styles.showNotes : ""}`}
              >
                <h2 className={styles.notesTitle}>Anotações</h2>
                <textarea
                  className={styles.noteInput}
                  rows={9}
                  cols={40}
                  ref={notesRef}
                  id="text"
                  defaultValue={
                    (content && content.contentProgress.notes) ?? ""
                  }
                ></textarea>
                <button className={styles.saveBtn} onClick={() => saveNote()}>
                  Salvar
                </button>
              </div>
              <div
                className={styles.icon}
                onClick={() => setOpenNotes(!openNotes)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={34}
                  height={34}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-notebook-pen-icon lucide-notebook-pen"
                >
                  <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
                  <path d="M2 6h4" />
                  <path d="M2 10h4" />
                  <path d="M2 14h4" />
                  <path d="M2 18h4" />
                  <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <h3 className={styles.contentDescription}>
          {allowedContents[contentType]?.description}
        </h3>
        {videoDuration ? (
          <p className={styles.duration}>Duração: {videoDuration}</p>
        ) : null}
        <button
          className={`${styles.btn} ${saving ? styles.saving : ""} ${content?.contentProgress.status === "COMPLETED" ? styles.completeContent : ""}`}
          onClick={() => complete()}
        >
          {content?.contentProgress.status === "COMPLETED"
            ? "Concluído"
            : saving
              ? "Concluindo..."
              : "Marcar como concluído"}
        </button>
      </div>
    </>
  );
}
