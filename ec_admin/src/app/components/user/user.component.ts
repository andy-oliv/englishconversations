import { Component, OnInit, signal } from '@angular/core';
import { UserStateService } from '../../services/user-state.service';
import User from '../../../entities/User';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  user = signal<User>({
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: '',
  });
  openMenu = signal<boolean>(false);

  constructor(
    private readonly userService: UserStateService,
    private readonly httpClient: HttpClient,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.user.set(this.userService.getUser());
  }

  onClick(): void {
    this.openMenu.set(!this.openMenu());
  }

  logout(): void {
    const subscription = this.httpClient.get<{ message: string }>(
      'http://localhost:3000/auth/logout',
      { withCredentials: true },
    );
    subscription.subscribe({
      complete: () => {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
