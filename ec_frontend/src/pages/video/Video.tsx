import { useEffect, useRef, useState, type ReactElement } from "react";
import VideoFrame from "../../components/videoFrame/VideoFrame";
import axios from "axios";
import { environment } from "../../environment/environment";
import { VideoSchema, type Video } from "../../schemas/video.schema";
import styles from "./styles/Video.module.scss";
import * as Sentry from "@sentry/react";
import completeContent from "../../helper/functions/completeContent";
import { useCurrentChapterStore } from "../../stores/currentChapterStore";
import saveNotes from "../../helper/functions/saveNotes";
import saveFavorite from "../../helper/functions/saveFavorite";

export default function Video(): ReactElement {
  async function complete(): Promise<void> {
    setSaving(true);
    await completeContent(
      currentContent?.id ?? null,
      currentContent?.contentProgress.id ?? null,
      setCurrentChapter,
      {
        isFavorite,
        notes,
        videoId: currentContent?.video?.id,
      }
    );
    setSaving(false);
  }

  function saveNote(): void {
    setNotes(notesRef.current ? notesRef.current.value : "");
    if (currentContent && notesRef.current) {
      saveNotes(
        currentContent?.id ?? null,
        currentContent?.contentProgress.id ?? null,
        setCurrentChapter,
        notesRef.current.value
      );
    }
    setOpenNotes(false);
  }

  function saveFavorites(): void {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    if (currentContent && notesRef.current) {
      saveFavorite(
        currentContent?.id ?? null,
        currentContent?.contentProgress.id ?? null,
        setCurrentChapter,
        newFavorite
      );
    }
  }

  const currentContent = useCurrentChapterStore((state) =>
    state.getCurrentContent()
  );
  const setCurrentChapter = useCurrentChapterStore(
    (state) => state.setCurrentChapter
  );
  const [video, setVideo] = useState<Video>();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(
    currentContent?.contentProgress?.isFavorite ?? false
  );
  const [notes, setNotes] = useState<string>(
    currentContent?.contentProgress.notes ?? ""
  );
  const [openNotes, setOpenNotes] = useState<boolean>(false);
  const notesRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    async function fetchVideo(): Promise<void> {
      try {
        setLoading(true);
        const response = await axios.get(
          `${environment.backendApiUrl}/videos/${currentContent?.video?.id}`,
          { withCredentials: true }
        );

        const parsedResponse = VideoSchema.safeParse(response.data.data);
        if (parsedResponse.success) {
          setLoading(false);
          setVideo(response.data.data);
          return;
        }

        setLoading(false);
        Sentry.captureException(parsedResponse.error, {
          extra: {
            context: "Video",
            action: "fetchVideo",
            issues: parsedResponse.error.issues,
          },
        });
      } catch (error) {
        setLoading(false);
        Sentry.captureException(error, {
          extra: {
            context: "Video",
            action: "fetchVideo",
            error,
          },
        });
      }
    }

    fetchVideo();
  }, [setVideo, currentContent?.video?.id]);

  return (
    <>
      {loading ? (
        <div className={styles.loader}>
          <div className={styles.videoLoader}></div>
          <div className={styles.infoLoaderWrapper}>
            <div className={styles.infoLoader}></div>
            <div className={styles.infoLoader}></div>
            <div className={styles.infoLoader}></div>
          </div>
        </div>
      ) : (
        <div>
          {video ? (
            <VideoFrame
              title={
                currentContent && currentContent.video
                  ? currentContent.video.title
                  : ""
              }
              videoSrc={video.url}
              width={1480}
              height={640}
            />
          ) : null}

          <div className={styles.info}>
            <div className={styles.videoTitleWrapper}>
              <h2 className={styles.videoTitle}>
                {currentContent?.video?.title}
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
                      defaultValue={currentContent?.contentProgress.notes ?? ""}
                    ></textarea>
                    <button
                      className={styles.saveBtn}
                      onClick={() => saveNote()}
                    >
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
            <h3 className={styles.videoDescription}>
              {currentContent?.video?.description}
            </h3>
            <p className={styles.videoDuration}>
              Duração: {video ? Math.floor(video.duration / 60) : 0} minutos
            </p>

            <button
              className={`${styles.btn} ${saving ? styles.saving : ""} ${currentContent?.contentProgress?.status === "COMPLETED" ? styles.completeContent : ""}`}
              onClick={() => complete()}
            >
              {currentContent?.contentProgress.status === "COMPLETED"
                ? "Concluído"
                : saving
                  ? "Concluindo..."
                  : "Marcar como concluído"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
