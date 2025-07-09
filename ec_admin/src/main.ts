import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Sentry from '@sentry/angular';

Sentry.init({
  dsn: 'https://8a586127d4d84e55ebb24eeb605cf450@o4509635507781632.ingest.us.sentry.io/4509635528359936',
  sendDefaultPii: true,
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
