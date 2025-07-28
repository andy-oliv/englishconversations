import { HttpClient } from '@angular/common/http';
import {
  Component,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { LogService } from '../../services/log.service';
import { ToastTypes } from '../../../common/types/ToastTypes';
import { toastMessages } from '../../../common/messages/toastMessages';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnChanges {
  passwordForm: FormGroup;
  loading = signal<boolean>(false);
  isClosed = output<boolean>();
  setClosed = input<boolean>(false);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly httpClient: HttpClient,
    private readonly toastService: ToastService,
    private readonly logService: LogService,
  ) {
    this.passwordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.setClosed()) {
      this.closeModal();
    }
  }

  onSubmit(): void {
    this.loading.set(true);
    const subscription = this.httpClient.post<{ message: string }>(
      `${environment.authUrl}/reset/password`,
      {
        email: this.passwordForm.get('email')?.value,
      },
      { withCredentials: true },
    );

    subscription.subscribe({
      next: (response) => {
        this.loading.set(false);

        this.toastService.toast.set({
          type: ToastTypes.SUCCESS,
          message: toastMessages.changePassword.status_200,
          duration: 3000,
        });
        this.toastService.callToast(this.toastService.toast().duration);
      },
      error: (error) => {
        this.loading.set(false);

        if (error.status === 409) {
          this.toastService.toast.set({
            type: ToastTypes.FAILURE,
            message: toastMessages.changePassword.status_409,
            duration: 2000,
          });
          this.toastService.callToast(this.toastService.toast().duration);
        } else if (error.status === 400) {
          this.toastService.toast.set({
            type: ToastTypes.FAILURE,
            message: toastMessages.changePassword.status_400,
            duration: 2000,
          });
          this.toastService.callToast(this.toastService.toast().duration);
        } else {
          this.toastService.toast.set({
            type: ToastTypes.FAILURE,
            message: toastMessages.changePassword.status_500,
            duration: 5000,
          });
          this.toastService.callToast(this.toastService.toast().duration);

          this.logService.handleException(error, 'changePassword');
        }
      },
    });
  }

  closeModal(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.isClosed.emit(true);
    this.passwordForm.get('email')?.setValue('');
  }
}
