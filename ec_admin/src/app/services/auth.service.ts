import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { envinronment } from '../../environments/environment';
import LoggedUser from '../../entities/loggedUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}

  login(): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(
      `${envinronment.authUrl}/admin/login`,
      {
        withCredentials: true,
      },
    );
  }

  logout(): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(
      `${envinronment.authUrl}/logout`,
      {
        withCredentials: true,
      },
    );
  }

  sessionCheck(): Observable<{ message: string; data: LoggedUser }> {
    return this.httpClient.get<{ message: string; data: LoggedUser }>(
      `${envinronment.authUrl}/admin-session`,
      {
        withCredentials: true,
      },
    );
  }
}
