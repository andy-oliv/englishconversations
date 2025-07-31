import type { ReactElement } from "react";
import styles from "./styles/VideoFrame.module.scss";
import type VideoFrameProps from "./VideoFrame.types";

export default function VideoFrame({
  title,
  videoSrc,
}: VideoFrameProps): ReactElement {
  return (
    <>
      <iframe
        width={560}
        height={400}
        src={videoSrc}
        title={title}
        allowFullScreen
        className={styles.videoFrame}
      ></iframe>
    </>
  );
}
