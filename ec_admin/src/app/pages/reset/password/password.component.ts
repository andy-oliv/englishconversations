import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { HttpClient } from '@angular/common/http';
import { LogService } from '../../../services/log.service';
import { ToastTypes } from '../../../../common/types/ToastTypes';
import { toastMessages } from '../../../../common/messages/toastMessages';
import { environment } from '../../../../environments/environment';
import dayjs from 'dayjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
})
export class PasswordComponent implements OnInit {
  form: FormGroup;
  success = signal<boolean>(false);
  passwordError = signal<boolean>(false);
  emailError = signal<boolean>(false);
  isPasswordVisible = signal<boolean>(false);
  timeoutDuration = signal<number>(5000);
  currentTime = signal<string>('');
  futureTime = signal<string>('');
  timeDifference = signal<number>(0);
  secondsToRedirect = signal<number>(this.timeoutDuration() / 1000);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly httpClient: HttpClient,
    private readonly logService: LogService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.form.get('email')?.valueChanges.subscribe(() => {
      const control = this.form.get('email');
      if (control?.invalid && control?.dirty) {
        this.emailError.set(true);
      } else {
        this.emailError.set(false);
      }
    });

    this.form.get('password')?.valueChanges.subscribe(() => {
      const control = this.form.get('password');
      if (control?.invalid && control?.dirty) {
        this.passwordError.set(true);
      } else {
        this.passwordError.set(false);
      }
    });
  }

  changePasswordVisibility(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  onSubmit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');
      if (!token) {
        this.toastService.toast.set({
          type: ToastTypes.FAILURE,
          message: toastMessages.passwordReset.status_400,
          duration: 5000,
        });

        this.toastService.callToast(this.toastService.toast().duration);

        this.router.navigate(['/']);
        return;
      }

      const passwordUpdateSubscription = this.httpClient.patch<{
        message: string;
      }>(
        `${environment.authUrl}/reset/password?token=${token}`,
        {
          email: this.form.get('email')?.value,
          password: this.form.get('password')?.value,
        },
        {
          withCredentials: true,
        },
      );

      passwordUpdateSubscription.subscribe({
        next: (response) => {
          this.success.set(true);
          this.currentTime.set(dayjs().toString());
          this.futureTime.set(
            dayjs()
              .add(this.timeoutDuration() / 1000, 'seconds')
              .toString(),
          );
          this.timeDifference.set(
            dayjs(this.currentTime()).diff(this.futureTime()),
          );

          this.startTimer();
        },
        error: (error) => {
          if (error.status === 400) {
            this.toastService.toast.set({
              type: ToastTypes.FAILURE,
              message: toastMessages.passwordReset.status_4002,
              duration: 5000,
            });

            this.toastService.callToast(this.toastService.toast().duration);
            this.logService.handleException(error, 'PasswordComponent');

            this.router.navigate(['/']);
          } else {
            this.toastService.toast.set({
              type: ToastTypes.FAILURE,
              message: toastMessages.passwordReset.status_500,
              duration: 5000,
            });

            this.toastService.callToast(this.toastService.toast().duration);
            this.logService.handleException(error, 'PasswordComponent');

            this.router.navigate(['/']);
          }
        },
      });
    });
  }

  startTimer(): void {
    const interval = setInterval(() => {
      this.secondsToRedirect.set(this.secondsToRedirect() - 1);
      this.currentTime.set(dayjs().toString());
      this.timeDifference.set(
        dayjs(this.currentTime()).diff(this.futureTime()),
      );

      if (this.timeDifference() >= 0) {
        clearInterval(interval);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }
}
