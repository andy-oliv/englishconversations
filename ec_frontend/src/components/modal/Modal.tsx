import { useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import styles from "./styles/Modal.module.scss";
import type ModalProps from "./Modal.types";
import Cropper from "react-easy-crop";

export default function Modal({
  onClose,
  src,
  getBlob,
}: ModalProps): ReactElement {
  async function getCroppedImg(
    imageSrc: File | null,
    pixelCrop: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  ): Promise<Blob | null> {
    const image = new Image();
    if (imageSrc) image.src = URL.createObjectURL(imageSrc);
    await image.decode();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = 300;
    canvas.height = 300;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
    });
  }

  async function saveImg(): Promise<void> {
    const blob = await getCroppedImg(
      src,
      croppedArea ? croppedArea : { x: 0, y: 0, width: 600, height: 600 }
    );

    if (blob) getBlob(blob);
    onClose();
  }

  const modalRoot = document.getElementById("modal-root") as HTMLElement;
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedArea, setCroppedArea] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropComplete = (
    _croppedArea: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
    croppedAreaPixels: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.cropArea}>
          <Cropper
            image={src ? URL.createObjectURL(src) : ""}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className={styles.btnContainer}>
          <button className={styles.saveBtn} onClick={() => saveImg()}>
            Cortar e salvar
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
