import { Injectable, signal } from '@angular/core';
import LoggedUser from '../../entities/loggedUser';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  user = signal<LoggedUser>({
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: '',
  });
  constructor() {}

  setLoggedUser(userData: LoggedUser) {
    this.user.set(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  getLoggedUser() {
    localStorage.getItem('user');
    return this.user();
  }

  resetLoggedUser() {
    this.user.set({
      id: '',
      name: '',
      email: '',
      avatar: '',
      role: '',
    });
    localStorage.removeItem('user');
  }
}
