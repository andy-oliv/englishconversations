import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuStateService } from '../../services/menu-state.service';
import { UserStateService } from '../../services/user-state.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { UserComponent } from '../../components/user/user.component';

@Component({
  selector: 'app-admin',
  imports: [
    NgClass,
    RouterOutlet,
    ModalComponent,
    MenuComponent,
    UserComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  currentRoute = signal<string>('');
  isMenuOpen = computed(() => this.menuState.isMenuOpen());
  isModalOpen = signal<boolean>(false);
  selectedOption = signal<string>('');

  constructor(
    private readonly menuState: MenuStateService,
    private readonly userService: UserStateService,
  ) {}

  ngOnInit() {
    const loadedUser: string | null = localStorage.getItem('user');
    if (loadedUser) {
      this.userService.setLoggedUser(JSON.parse(loadedUser));
    }
  }

  handleSelection(event: string): void {
    this.selectedOption.set(event);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }
}
