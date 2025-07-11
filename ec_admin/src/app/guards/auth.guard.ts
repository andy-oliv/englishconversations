import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UserStateService } from '../services/user-state.service';
import LoggedUser from '../../entities/loggedUser';

export const authGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const userService = inject(UserStateService);

  return http
    .get<{ message: string; data: LoggedUser }>(
      'http://localhost:3000/auth/admin-session',
      {
        withCredentials: true,
      },
    )
    .pipe(
      map((response) => {
        if (response.data.id) {
          userService.setLoggedUser(response.data);
          return true;
        } else {
          return router.parseUrl('/login');
        }
      }),
      catchError((error) => {
        userService.resetLoggedUser();
        return of(router.parseUrl('/login'));
      }),
    );
};
