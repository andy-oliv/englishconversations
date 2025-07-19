import { Injectable, signal } from '@angular/core';
import { LoggedUser, LoggedUserSchema } from '../../schemas/loggedUser.schema';
import { HttpClient } from '@angular/common/http';
import { User, UserSchema } from '../../schemas/user.schema';
import { environment } from '../../environments/environment';
import { LogService } from './log.service';
import { exceptionMessages } from '../../common/messages/exceptionMessages';
import { UserUpdate } from '../../schemas/userUpdate.schema';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  loggedUser = signal<LoggedUser | null>(null);
  private user = signal<User | null>(null);
  readonly userSignal = this.user.asReadonly();

  constructor(
    private readonly httpClient: HttpClient,
    private readonly logService: LogService,
  ) {
    const storedLoggedUser: string | null =
      sessionStorage.getItem('loggedUser');
    const storedUser: string | null = sessionStorage.getItem('user');

    if (storedLoggedUser) {
      const parsedLoggedUser: LoggedUser = LoggedUserSchema.parse(
        JSON.parse(storedLoggedUser),
      );
      this.loggedUser.set(parsedLoggedUser);
    }

    if (storedUser) {
      const parsedUser: User = UserSchema.parse(JSON.parse(storedUser));
      this.user.set(parsedUser);
    }
  }

  fetchUser(): void {
    const subscription = this.httpClient.get<{
      message: string;
      data: unknown;
    }>(`${environment.apiUrl}/users/${this.loggedUser()?.id}`, {
      withCredentials: true,
    });

    subscription.subscribe({
      next: (response) => {
        const validatedData = UserSchema.safeParse(response.data);
        if (validatedData.success) {
          this.user.set(validatedData.data);
          sessionStorage.setItem('user', JSON.stringify(validatedData.data));
        } else {
          this.logService.logError(exceptionMessages.zod, {
            issues: validatedData.error.issues,
          });
        }
      },
      error: (error) => {
        this.logService.handleException(error, 'UserStateService');
      },
    });
  }

  setLoggedUser(userData: LoggedUser) {
    this.loggedUser.set(userData);
    sessionStorage.setItem('loggedUser', JSON.stringify(userData));
    this.fetchUser();
  }

  getLoggedUser(): LoggedUser | null {
    return this.loggedUser();
  }

  resetLoggedUser() {
    this.loggedUser.set(null);
    this.user.set(null);
    sessionStorage.removeItem('loggedUser');
    sessionStorage.removeItem('user');
  }
}
