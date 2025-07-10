import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { TitleComponent } from '../../components/title/title.component';
import User from '../../../entities/User';
import { DashboardService } from '../../services/dashboard.service';
import dayjs from 'dayjs';
import Notification from '../../../entities/Notification';

@Component({
  selector: 'app-home',
  imports: [InfoCardComponent, TitleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild('nameFilter') nameFilter!: ElementRef;
  @ViewChild('progressFilter') progressFilter!: ElementRef;

  monthlyLogins = signal<{ loginDate: string; logins: number }[]>([]);
  latestLogins = signal<Partial<User>[]>([]);
  notifications = signal<Partial<Notification>[]>([]);
  userProgressesRaw = signal<Partial<User>[]>([]);
  userProgresses = signal<
    {
      id: string | undefined;
      name: string | undefined;
      completedChapters: number;
      totalProgress: number;
    }[]
  >([]);
  sortedProgresses = signal<
    {
      id: string | undefined;
      name: string | undefined;
      completedChapters: number;
      totalProgress: number;
    }[]
  >([]);
  totalStudents = signal<number>(0);
  totalChapters = signal<number>(0);
  totalUnits = signal<number>(0);
  totalVideos = signal<number>(0);
  totalExercises = signal<number>(0);
  dataset = signal<{ date: string; logins: number }[]>([]);
  loading = signal<boolean>(true);

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.fetchDashboardData().subscribe({
      next: (response) => {
        this.monthlyLogins.set(response.data.monthlyLogins);
        this.latestLogins.set(response.data.latestLogins);
        this.userProgressesRaw.set(response.data.userProgresses);
        this.totalStudents.set(response.data.totalStudents);
        this.totalChapters.set(response.data.totalChapters);
        this.totalUnits.set(response.data.totalUnits);
        this.totalVideos.set(response.data.totalVideos);
        this.totalExercises.set(response.data.totalExercises);
        this.notifications.set(response.data.notifications);

        this.generateProgressArray();

        this.prepareChartDataset();
      },
      error: (error) => {
        console.error('Erro ao carregar dados do dashboard:', error);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  generateProgressArray(): void {
    let temporaryProgresses: {
      id: string | undefined;
      name: string | undefined;
      completedChapters: number;
      totalProgress: number;
    }[] = [];

    this.userProgressesRaw().forEach((user: Partial<User>) => {
      temporaryProgresses.push({
        id: user.id,
        name: user.name,
        ...this.getUserProgress(user),
      });
    });

    this.userProgresses.set(temporaryProgresses);
    this.sortedProgresses.set(this.userProgresses());
  }

  getUserProgress(user: Partial<User>): {
    completedChapters: number;
    totalProgress: number;
  } {
    let completedChapters: number = 0;

    user.chapters?.forEach((chapter: { status: string }) => {
      if (chapter.status === 'COMPLETED') {
        completedChapters = completedChapters + 1;
      }
    });

    return {
      completedChapters,
      totalProgress: (completedChapters / this.totalChapters()) * 100,
    };
  }

  prepareChartDataset() {
    const today = dayjs();
    const start = today.startOf('month');
    const end = today.endOf('month');
    const allDates = [];

    for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, 'day')) {
      allDates.push(d.format('DD/MM'));
    }

    let temporarySet: { date: string; logins: number }[] = [];

    allDates.forEach((date) => {
      this.monthlyLogins().forEach((entry) => {
        if (date === entry.loginDate) {
          temporarySet.push({ date: date, logins: entry.logins });
        } else {
          temporarySet.push({ date: date, logins: 0 });
        }
      });
    });

    this.dataset.set(temporarySet);
  }

  filterName(event: Event): void {
    const selection: string = (event.target as HTMLSelectElement).value;

    if (selection !== 'n/a') {
      this.progressFilter.nativeElement.value = 'n/a';
    }

    if (selection === 'a-z') {
      const sorted = [...this.userProgresses()].sort((a, b) =>
        (a.name || '').localeCompare(b.name || ''),
      );
      this.sortedProgresses.set(sorted);
    }

    if (selection === 'z-a') {
      const sorted = [...this.userProgresses()].sort((a, b) =>
        (b.name || '').localeCompare(a.name || ''),
      );
      this.sortedProgresses.set(sorted);
    }

    if (selection === 'n/a') {
      this.sortedProgresses.set(this.userProgresses());
    }
  }

  filterProgress(event: Event): void {
    const selection: string = (event.target as HTMLSelectElement).value;

    if (selection !== 'n/a') {
      this.nameFilter.nativeElement.value = 'n/a';
    }

    if (selection === 'more') {
      const sorted = [...this.userProgresses()].sort(
        (a, b) => b.totalProgress - a.totalProgress,
      );
      this.sortedProgresses.set(sorted);
    }

    if (selection === 'less') {
      const sorted = [...this.userProgresses()].sort(
        (a, b) => a.totalProgress - b.totalProgress,
      );
      this.sortedProgresses.set(sorted);
    }

    if (selection === 'n/a') {
      this.sortedProgresses.set(this.userProgresses());
    }
  }
}
