import type { ReactElement } from "react";
import styles from "./styles/VideoFrame.module.scss";
import type VideoFrameProps from "./VideoFrame.types";

export default function VideoFrame({
  title,
  videoSrc,
  width,
  height,
}: VideoFrameProps): ReactElement {
  return (
    <>
      <iframe
        width={width ? width : 560}
        height={height ? height : 400}
        src={videoSrc}
        title={title}
        allowFullScreen
        className={styles.videoFrame}
      ></iframe>
    </>
  );
}
