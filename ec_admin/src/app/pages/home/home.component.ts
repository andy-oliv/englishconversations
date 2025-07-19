import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { TitleComponent } from '../../components/title/title.component';
import { User } from '../../../schemas/user.schema';
import { DashboardService } from '../../services/dashboard.service';
import dayjs from 'dayjs';
import { Dashboard } from '../../../schemas/dashboardData.schema';

@Component({
  selector: 'app-home',
  imports: [InfoCardComponent, TitleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild('nameFilter') nameFilter!: ElementRef;
  @ViewChild('progressFilter') progressFilter!: ElementRef;

  dashboard = signal<Dashboard>({
    monthlyLogins: [],
    latestLogins: [],
    userProgresses: [],
    totalStudents: 0,
    totalChapters: 0,
    totalUnits: 0,
    totalVideos: 0,
    totalExercises: 0,
    notifications: [],
  });

  unsortedProgresses = signal<
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
  dataset = signal<{ date: string; logins: number }[]>([]);
  loading = signal<boolean>(true);

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.fetchDashboardData().subscribe({
      next: (response) => {
        this.dashboard.set({
          monthlyLogins: response.data.monthlyLogins,
          latestLogins: response.data.latestLogins,
          userProgresses: response.data.userProgresses,
          totalStudents: response.data.totalStudents,
          totalChapters: response.data.totalChapters,
          totalUnits: response.data.totalUnits,
          totalVideos: response.data.totalVideos,
          totalExercises: response.data.totalExercises,
          notifications: response.data.notifications,
        });

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

    this.dashboard().userProgresses.forEach((user) => {
      temporaryProgresses.push({
        id: user.id,
        name: user.name,
        ...this.getUserProgress(user),
      });
    });

    this.unsortedProgresses.set(temporaryProgresses);
    this.sortedProgresses.set(this.unsortedProgresses());
  }

  getUserProgress(user: Partial<User>): {
    completedChapters: number;
    totalProgress: number;
  } {
    let completedChapters: number = 0;

    user.chapters?.forEach((chapter) => {
      if (chapter.status === 'COMPLETED') {
        completedChapters = completedChapters + 1;
      }
    });

    return {
      completedChapters,
      totalProgress: (completedChapters / this.dashboard().totalChapters) * 100,
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
      this.dashboard().monthlyLogins.forEach((entry) => {
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
      const sorted = [...this.unsortedProgresses()].sort((a, b) =>
        (a.name || '').localeCompare(b.name || ''),
      );
      this.sortedProgresses.set(sorted);
    }

    if (selection === 'z-a') {
      const sorted = [...this.unsortedProgresses()].sort((a, b) =>
        (b.name || '').localeCompare(a.name || ''),
      );
      this.sortedProgresses.set(sorted);
    }

    if (selection === 'n/a') {
      this.sortedProgresses.set(this.unsortedProgresses());
    }
  }

  filterProgress(event: Event): void {
    const selection: string = (event.target as HTMLSelectElement).value;

    if (selection !== 'n/a') {
      this.nameFilter.nativeElement.value = 'n/a';
    }

    if (selection === 'more') {
      const sorted = [...this.unsortedProgresses()].sort(
        (a, b) => b.totalProgress - a.totalProgress,
      );
      this.sortedProgresses.set(sorted);
    }

    if (selection === 'less') {
      const sorted = [...this.unsortedProgresses()].sort(
        (a, b) => a.totalProgress - b.totalProgress,
      );
      this.sortedProgresses.set(sorted);
    }

    if (selection === 'n/a') {
      this.sortedProgresses.set(this.unsortedProgresses());
    }
  }
}
