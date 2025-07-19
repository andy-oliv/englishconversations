import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuStateService } from '../../services/menu-state.service';
import { UserStateService } from '../../services/user-state.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { UserComponent } from '../../components/user/user.component';
import { TimerComponent } from '../../components/timer/timer.component';
import { TimerService } from '../../services/timer.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-admin',
  imports: [
    NgClass,
    RouterOutlet,
    ModalComponent,
    MenuComponent,
    UserComponent,
    TimerComponent,
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
    private readonly timerService: TimerService,
  ) {}

  ngOnInit() {
    const loadedUser: string | null = localStorage.getItem('user');
    if (loadedUser) {
      this.userService.setLoggedUser(JSON.parse(loadedUser));
    }

    const storedTime = sessionStorage.getItem('timeReference');
    this.timerService.changeStyle.set(false);
    this.timerService.animate.set(false);

    if (storedTime) {
      const parsedTime = dayjs(JSON.parse(storedTime));
      this.timerService.startTime.set(parsedTime);
      this.timerService.endTime.set(parsedTime.add(60, 'minutes'));
      this.timerService.startTimer();
    } else {
      this.timerService.startTime.set(dayjs());
      this.timerService.endTime.set(
        this.timerService.startTime().add(60, 'minutes'),
      );
      this.timerService.startTimer();

      sessionStorage.setItem(
        'timeReference',
        JSON.stringify(this.timerService.startTime()),
      );
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
