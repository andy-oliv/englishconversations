import { useEffect, useState, type ReactElement } from "react";
import VideoFrame from "../../components/videoFrame/VideoFrame";
import axios from "axios";
import { environment } from "../../environment/environment";
import { VideoSchema, type Video } from "../../schemas/video.schema";
import styles from "./styles/Video.module.scss";
import * as Sentry from "@sentry/react";
import { useCurrentChapterStore } from "../../stores/currentChapterStore";
import ContentDescription from "../../components/contentDescription/ContentDescription";

export default function Video(): ReactElement {
  const currentContent = useCurrentChapterStore((state) =>
    state.getCurrentContent()
  );
  const [video, setVideo] = useState<Video>();
  const [loading, setLoading] = useState<boolean>(false);

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
          <ContentDescription
            key={currentContent?.id}
            content={currentContent}
            contentType={currentContent?.contentType ?? "VIDEO"}
          />
        </div>
      )}
    </>
  );
}
