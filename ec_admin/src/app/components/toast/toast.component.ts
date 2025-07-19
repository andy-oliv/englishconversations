import { Component, computed, output, signal } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  toast = computed(() => this.toastService.toast());
  isActive = computed(() => this.toastService.isActive());

  constructor(private readonly toastService: ToastService) {}
}
