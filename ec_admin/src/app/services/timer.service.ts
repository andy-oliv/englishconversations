import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  changeStyle = signal<boolean>(false);
  animate = signal<boolean>(false);
  hour = signal<string>('00');
  minute = signal<string>('00');
  second = signal<string>('00');

  startTime = signal<Dayjs>(dayjs());
  currentTime = signal<Dayjs>(dayjs());
  endTime = signal<Dayjs>(dayjs(this.startTime()).add(60, 'minutes'));

  constructor(private readonly router: Router) {}

  startTimer(): void {
    const storedTime: string | null = sessionStorage.getItem('timeReference');

    if (storedTime) {
      this.startTime.set(dayjs(JSON.parse(storedTime)));
      this.endTime.set(dayjs(this.startTime()).add(60, 'minutes'));
    }

    const timer = setInterval(() => {
      this.currentTime.set(dayjs());
      if (dayjs(this.currentTime()).isAfter(this.endTime())) {
        this.clearTimer(timer);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('loggedUser');
        sessionStorage.removeItem('timeReference');
        this.router.navigate(['/login']);
      }

      const differenceInSeconds =
        dayjs(this.endTime()).diff(this.currentTime(), 'seconds') % 60;

      this.second.set(differenceInSeconds.toString().padStart(2, '0'));

      this.minute.set(
        dayjs(this.endTime())
          .diff(this.currentTime(), 'minutes')
          .toString()
          .padStart(2, '0'),
      );

      this.hour.set(
        dayjs(this.endTime())
          .diff(this.currentTime(), 'hours')
          .toString()
          .padStart(2, '0'),
      );

      if (dayjs(this.endTime()).diff(this.currentTime(), 'minutes') <= 5) {
        this.changeStyle.set(true);
      }

      if (dayjs(this.endTime()).diff(this.currentTime(), 'minutes') <= 2) {
        this.animate.set(true);
      }
    }, 1000);
  }

  clearTimer(id: ReturnType<typeof setInterval>): void {
    clearInterval(id);
  }
}
