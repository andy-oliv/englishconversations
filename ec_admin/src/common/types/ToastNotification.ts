import { ToastTypes } from './ToastTypes';

export default interface ToastNotification {
  type: ToastTypes;
  message: string;
  duration: number;
}
