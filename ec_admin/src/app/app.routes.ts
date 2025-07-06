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

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'content',
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
    component: UsersComponent,
  },
  {
    path: 'progress',
    component: ProgressComponent,
  },
  {
    path: 'tests',
    component: TestsComponent,
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'security',
    component: SecurityComponent,
  },
];
