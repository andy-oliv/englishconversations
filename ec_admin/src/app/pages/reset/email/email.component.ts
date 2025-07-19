import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ToastTypes } from '../../../../common/types/ToastTypes';
import { toastMessages } from '../../../../common/messages/toastMessages';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../services/log.service';

@Component({
  selector: 'app-email',
  imports: [RouterLink],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss',
})
export class EmailComponent implements OnInit {
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
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');
      if (!token) {
        this.toastService.toast.set({
          type: ToastTypes.FAILURE,
          message: toastMessages.emailReset.status_400,
          duration: 5000,
        });

        this.toastService.callToast(this.toastService.toast().duration);

        this.router.navigate(['/']);
        return;
      }

      const emailUpdateSubscription = this.httpClient.patch<{
        message: string;
      }>(`${environment.authUrl}/reset/email?token=${token}`, null, {
        withCredentials: true,
      });

      emailUpdateSubscription.subscribe({
        next: (response) => {
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
              message: toastMessages.emailReset.status_4002,
              duration: 5000,
            });

            this.toastService.callToast(this.toastService.toast().duration);
            this.logService.handleException(error, 'emailComponent');

            this.router.navigate(['/']);
          } else {
            this.toastService.toast.set({
              type: ToastTypes.FAILURE,
              message: toastMessages.emailReset.status_500,
              duration: 5000,
            });

            this.toastService.callToast(this.toastService.toast().duration);
            this.logService.handleException(error, 'emailComponent');

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
