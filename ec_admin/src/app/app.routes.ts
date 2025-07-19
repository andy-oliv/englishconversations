import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContentComponent } from './pages/content/content.component';
import { ChaptersComponent } from './pages/chapters/chapters.component';
import { UnitsComponent } from './pages/units/units.component';
import { MediaComponent } from './pages/media/media.component';
import { UsersComponent } from './pages/users/users.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { TestsComponent } from './pages/tests/tests.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SecurityComponent } from './pages/security/security.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { EmailComponent } from './pages/reset/email/email.component';
import { PasswordComponent } from './pages/reset/password/password.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin/home',
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        canActivate: [authGuard],
        component: HomeComponent,
      },
      {
        path: 'content',
        canActivate: [authGuard],
        component: ContentComponent,
        children: [
          {
            path: 'chapters',
            component: ChaptersComponent,
          },
          {
            path: 'units',
            component: UnitsComponent,
          },
          {
            path: 'media',
            component: MediaComponent,
          },
        ],
      },
      {
        path: 'users',
        canActivate: [authGuard],
        component: UsersComponent,
      },
      {
        path: 'progress',
        canActivate: [authGuard],
        component: ProgressComponent,
      },
      {
        path: 'tests',
        canActivate: [authGuard],
        component: TestsComponent,
      },
      {
        path: 'notifications',
        canActivate: [authGuard],
        component: NotificationsComponent,
      },
      {
        path: 'settings',
        canActivate: [authGuard],
        component: SettingsComponent,
      },
      {
        path: 'security',
        canActivate: [authGuard],
        component: SecurityComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'email-reset',
    component: EmailComponent,
  },
  {
    path: 'password-reset',
    component: PasswordComponent,
  },
];
