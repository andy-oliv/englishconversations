import { Component, OnInit, signal } from '@angular/core';
import { UserStateService } from '../../services/user-state.service';
import User from '../../../entities/loggedUser';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  menuFlag = signal<boolean>(false);

  constructor(
    private readonly userService: UserStateService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.user.set(this.userService.getLoggedUser());
  }

  openMenu(): void {
    if (this.menuFlag() === false) {
      this.menuFlag.set(true);
    }
  }

  closeMenu(): void {
    if (this.menuFlag() === true) {
      this.menuFlag.set(false);
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
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
