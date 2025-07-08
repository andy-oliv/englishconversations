import { Injectable, signal } from '@angular/core';
import User from '../../entities/User';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  user = signal<User>({
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: '',
  });
  constructor() {}

  setUser(userData: User) {
    this.user.set(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  getUser() {
    localStorage.getItem('user');
    return this.user();
  }

  reset() {
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
