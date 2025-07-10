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

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly logService: LogService,
    private formBuilder: FormBuilder,
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
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.logService.logWarning(
              'Failed login attempt',
              error.error.message,
            );
            this.loading.set(false);
            this.showError.set(true);
            setTimeout(() => {
              this.showError.set(false);
            }, 2000);
          },
        });

      this.loginForm.reset();
    }
  }
}
