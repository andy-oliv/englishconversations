import { Injectable, signal } from '@angular/core';
import ToastNotification from '../../common/types/ToastNotification';
import { ToastTypes } from '../../common/types/ToastTypes';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast = signal<ToastNotification>({
    type: ToastTypes.SUCCESS,
    message: 'Login bem sucedido!',
    duration: 2000,
  });
  isActive = signal<boolean>(false);

  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  callToast(duration: number): void {
    this.closeToast();

    this.isActive.set(true);

    this.toastTimeout = setTimeout(() => this.closeToast(), duration);
  }

  closeToast(): void {
    this.clearToastTimeout();
    this.isActive.set(false);
  }

  private clearToastTimeout(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }
}
