import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';
import { ToastService } from '../../services/toast.service';
import { ToastTypes } from '../../../common/types/ToastTypes';
import { toastMessages } from '../../../common/messages/toastMessages';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = signal<boolean>(false);
  showError = signal<boolean>(false);
  emailError = signal<boolean>(false);
  passwordError = signal<boolean>(false);
  isPasswordVisible = signal<boolean>(false);
  isLoginSuccessful = signal<boolean>(false);

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly logService: LogService,
    private formBuilder: FormBuilder,
    private readonly toastService: ToastService,
  ) {
    this.loginForm = this.formBuilder.group({
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

  ngOnInit() {
    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      const control = this.loginForm.get('password');
      if (control?.invalid && control?.dirty) {
        this.passwordError.set(true);
      } else {
        this.passwordError.set(false);
      }
    });

    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      const control = this.loginForm.get('email');
      if (control?.invalid && control?.dirty) {
        this.emailError.set(true);
      } else {
        this.emailError.set(false);
      }
    });
  }

  changePasswordVisibility(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showError.set(true);
      setTimeout(() => {
        this.showError.set(false);
      }, 2000);
    } else {
      this.loading.set(true);
      this.httpClient
        .post<{
          message: string;
        }>(
          'http://localhost:3000/auth/admin/login',
          {
            email: this.loginForm.get('email')?.value,
            password: this.loginForm.get('password')?.value,
          },
          { withCredentials: true },
        )
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.isLoginSuccessful.set(true);

            this.toastService.toast.set({
              type: ToastTypes.SUCCESS,
              message: toastMessages.login.status_200,
              duration: 2000,
            });
            this.toastService.callToast(this.toastService.toast().duration);

            setTimeout(() => {
              this.loginForm.reset();
              this.router.navigate(['admin/home']);
            }, this.toastService.toast().duration);
          },
          error: (error) => {
            if (error.status === 429) {
              this.loading.set(false);

              this.toastService.toast.set({
                type: ToastTypes.WARNING,
                message: toastMessages.login.status_429,
                duration: 5000,
              });
              this.toastService.callToast(this.toastService.toast().duration);
            } else {
              this.logService.logWarning(
                'Failed login attempt',
                error.error.message,
              );
              this.loading.set(false);
              this.showError.set(true);

              this.toastService.toast.set({
                type: ToastTypes.FAILURE,
                message: toastMessages.login.status_400,
                duration: 3000,
              });
              this.toastService.callToast(this.toastService.toast().duration);
              setTimeout(() => {
                this.showError.set(false);
              }, this.toastService.toast().duration);
            }
          },
        });
    }
  }
}
