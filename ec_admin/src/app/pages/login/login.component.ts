import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
  ) {}

  onSubmit(form: NgForm): void {
    const { email, password } = form.value;
    this.httpClient
      .post<{
        message: string;
      }>(
        'http://localhost:3000/auth/admin/login',
        { email, password },
        { withCredentials: true },
      )
      .subscribe({
        complete: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.log(error.error);
        },
      });

    form.reset();
  }
}
