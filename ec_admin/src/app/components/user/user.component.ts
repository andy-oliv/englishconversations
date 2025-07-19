import { Component, computed, output, signal } from '@angular/core';
import { UserStateService } from '../../services/user-state.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user = computed(() => this.userService.userSignal());
  menuFlag = signal<boolean>(false);
  selectedOption = output<string>();

  constructor(
    private readonly userService: UserStateService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

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
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('loggedUser');
        sessionStorage.removeItem('timeReference');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  editProfile(): void {
    this.selectedOption.emit('editProfile');
  }

  changeEmail(): void {
    this.selectedOption.emit('changeEmail');
  }

  changePassword(): void {
    this.selectedOption.emit('changePassword');
  }
}
