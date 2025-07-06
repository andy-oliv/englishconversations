import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http
    .get<{ message: string }>('http://localhost:3000/auth/session', {
      withCredentials: true,
    })
    .pipe(
      map((response) => {
        if (response.message) {
          return true;
        } else {
          return router.parseUrl('/login');
        }
      }),
      catchError(() => {
        return of(router.parseUrl('/login'));
      }),
    );
};
