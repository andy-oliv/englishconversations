import { useEffect, useState, type ReactElement } from "react";
import VideoFrame from "../../components/videoFrame/VideoFrame";
import axios from "axios";
import { environment } from "../../environment/environment";
import { VideoSchema, type Video } from "../../schemas/video.schema";
import styles from "./styles/Video.module.scss";
import * as Sentry from "@sentry/react";
import { useCurrentChapterStore } from "../../stores/currentChapterStore";
import ContentDescription from "../../components/contentDescription/ContentDescription";
import { useLocation } from "react-router-dom";
import type { Content } from "../../schemas/content.schema";
import type { Unit } from "../../schemas/unit.schema";

export default function Video(): ReactElement {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const videoId = searchParams.get("id");
  const currentContent = useCurrentChapterStore((state) =>
    state.getCurrentContent()
  );
  const currentChapter = useCurrentChapterStore((state) => state.data);
  const activeUnit: Unit | undefined = currentChapter?.units.find((unit) =>
    unit.contents.some((content) => {
      const ids = [content.video?.id, content.slideshow?.id, content.quiz?.id];
      return ids.includes(videoId ?? "");
    })
  );
  const activeContent: Content | undefined = activeUnit?.contents.find(
    (content) => content?.video?.id === videoId
  );
  const [video, setVideo] = useState<Video>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!videoId) {
      return;
    }

    async function fetchVideo(): Promise<void> {
      try {
        setLoading(true);
        const response = await axios.get(
          `${environment.backendApiUrl}/videos/${videoId}`,
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
  }, [setVideo, videoId]);

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
        <div className={styles.videoContainer}>
          {video ? (
            <VideoFrame
              title={video.title}
              videoSrc={video.url}
              width={1480}
              height={640}
            />
          ) : null}
          <ContentDescription
            key={activeContent?.id}
            content={activeContent ? activeContent : currentContent}
            contentType={"VIDEO"}
            videoDuration={video ? video.duration / 60 : undefined}
          />
        </div>
      )}
    </>
  );
}
