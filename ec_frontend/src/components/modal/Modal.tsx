import { useEffect, useRef, type ReactElement } from "react";
import { createPortal } from "react-dom";
import styles from "./styles/Modal.module.scss";
import type ModalProps from "./Modal.types";

export default function Modal({ onClose, src }: ModalProps): ReactElement {
  const modalRoot = document.getElementById("modal-root") as HTMLElement;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = src;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
      };
    }
  }, [src]);

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(event) => event.stopPropagation()}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>,
    modalRoot
  );
}
