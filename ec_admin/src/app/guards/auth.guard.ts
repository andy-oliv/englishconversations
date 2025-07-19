import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UserStateService } from '../services/user-state.service';
import { LoggedUserSchema } from '../../schemas/loggedUser.schema';
import { LogService } from '../services/log.service';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const userService = inject(UserStateService);
  const logService = inject(LogService);

  return http
    .get<{ message: string; data: unknown }>(
      `${environment.authUrl}/admin-session`,
      {
        withCredentials: true,
      },
    )
    .pipe(
      map((response) => {
        const result = LoggedUserSchema.safeParse(response.data);
        if (!result.success) {
          userService.resetLoggedUser();
          return router.parseUrl('/login');
        }

        userService.setLoggedUser(result.data);
        return true;
      }),
      catchError((error) => {
        userService.resetLoggedUser();
        logService.handleException(error, 'authGuard');
        return of(router.parseUrl('/login'));
      }),
    );
};
