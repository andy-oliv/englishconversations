export default interface ModalProps {
  src: File | null;
  onClose: () => void;
  getBlob: (blob: Blob) => void;
}
