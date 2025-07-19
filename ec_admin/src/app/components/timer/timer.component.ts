import { NgClass } from '@angular/common';
import { Component, computed } from '@angular/core';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-timer',
  imports: [NgClass],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent {
  changeStyle = computed<boolean>(() => this.timerService.changeStyle());
  animate = computed<boolean>(() => this.timerService.animate());
  hour = computed<string>(() => this.timerService.hour());
  minute = computed<string>(() => this.timerService.minute());
  second = computed<string>(() => this.timerService.second());

  constructor(private readonly timerService: TimerService) {}
}
