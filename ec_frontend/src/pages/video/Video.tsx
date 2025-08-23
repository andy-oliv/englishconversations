import { useEffect, useRef, useState, type ReactElement } from "react";
import VideoFrame from "../../components/videoFrame/VideoFrame";
import axios from "axios";
import { environment } from "../../environment/environment";
import { useCurrentContentStore } from "../../stores/currentContentStore";
import { VideoSchema, type Video } from "../../schemas/video.schema";
import styles from "./styles/Video.module.scss";
import * as Sentry from "@sentry/react";
import completeContent from "../../helper/functions/completeContent";
import { useCurrentUnitStore } from "../../stores/currentUnitStore";

export default function Video(): ReactElement {
  async function complete(): Promise<void> {
    setSaving(true);
    await completeContent(
      currentContent?.id ?? null,
      currentContent?.userContentId ?? null,
      setUnit,
      setCurrentContent,
      {
        isFavorite,
        notes,
        videoId: currentContent?.contentId,
      }
    );
    setSaving(false);
  }

  function saveNotes(): void {
    setOpenNotes(false);
    setNotes(notesRef.current ? notesRef.current.value : "");
  }

  const currentContent = useCurrentContentStore((state) => state.content);
  const [video, setVideo] = useState<Video>();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(
    currentContent?.isFavorite ?? false
  );
  const [notes, setNotes] = useState<string>(currentContent?.notes ?? "");
  const [openNotes, setOpenNotes] = useState<boolean>(false);
  const notesRef = useRef<HTMLTextAreaElement | null>(null);
  const setUnit = useCurrentUnitStore((state) => state.setUnit);
  const setCurrentContent = useCurrentContentStore((state) => state.setContent);

  useEffect(() => {
    async function fetchVideo(): Promise<void> {
      try {
        setLoading(true);
        const response = await axios.get(
          `${environment.backendApiUrl}/videos/${currentContent?.contentId}`,
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
  }, [setVideo, currentContent, isFavorite, notes]);

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
          <VideoFrame
            title={currentContent ? currentContent.title : ""}
            videoSrc={video ? video.url : ""}
            width={1480}
            height={640}
          />
          <div className={styles.info}>
            <div className={styles.videoTitleWrapper}>
              <h2 className={styles.videoTitle}>{currentContent?.title}</h2>
              <div className={styles.icons}>
                <div
                  className={styles.icon}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
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
                    <textarea
                      className={styles.noteInput}
                      rows={9}
                      cols={40}
                      ref={notesRef}
                      defaultValue={currentContent?.notes ?? ""}
                    ></textarea>
                    <button
                      className={styles.saveBtn}
                      onClick={() => saveNotes()}
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
              {currentContent?.description}
            </h3>
            <p className={styles.videoDuration}>
              Duração: {video ? Math.floor(video.duration / 60) : 0} minutos
            </p>

            <button
              className={`${styles.btn} ${saving ? styles.saving : ""} ${currentContent?.isComplete ? styles.completeContent : ""}`}
              onClick={() => complete()}
            >
              {currentContent?.isComplete
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
