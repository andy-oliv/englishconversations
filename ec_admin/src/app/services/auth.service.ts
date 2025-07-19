import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoggedUser } from '../../schemas/loggedUser.schema';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly userService: UserStateService,
  ) {}

  login(): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(
      `${environment.authUrl}/admin/login`,
      {
        withCredentials: true,
      },
    );
  }

  logout(): Observable<{ message: string }> {
    this.userService.resetLoggedUser();
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('loggedUser');
    sessionStorage.removeItem('timeReference');

    return this.httpClient.get<{ message: string }>(
      `${environment.authUrl}/logout`,
      {
        withCredentials: true,
      },
    );
  }

  sessionCheck(): Observable<{ message: string; data: LoggedUser }> {
    return this.httpClient.get<{ message: string; data: LoggedUser }>(
      `${environment.authUrl}/admin-session`,
      {
        withCredentials: true,
      },
    );
  }
}
