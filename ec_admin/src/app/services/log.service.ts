import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor() {}

  logMessage(message: string, data?: any): void {
    Sentry.captureMessage(message, 'info');
    console.log(`[INFO]: ${message}`, data);
  }

  logWarning(message: string, data?: any): void {
    Sentry.captureMessage(message, 'warning');
    console.warn(`[WARNING]: ${message}`, data);
  }

  logError(message: string, data?: any): void {
    Sentry.captureMessage(message, 'error');
    console.error(`[ERROR]: ${message}`, data);
  }

  handleException(error: any, context?: string): void {
    Sentry.captureException(error, {
      extra: { context },
    });
    console.error(`Erro capturado:`, error);
  }
}
