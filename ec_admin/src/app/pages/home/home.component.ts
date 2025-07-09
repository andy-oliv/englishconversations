import { Component, OnInit, signal } from '@angular/core';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { TitleComponent } from '../../components/title/title.component';
import User from '../../../entities/User';
import { DashboardService } from '../../services/dashboard.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-home',
  imports: [InfoCardComponent, TitleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  lastLoggedUsers = signal<User[]>([]);
  totalStudents = signal<number>(0);
  totalChapters = signal<number>(0);
  totalUnits = signal<number>(0);
  totalVideos = signal<number>(0);
  totalExercises = signal<number>(0);
  loading = signal<boolean>(true);

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.fetchDashboardData().subscribe({
      next: (response) => {
        this.lastLoggedUsers.set(response.data.users);
        this.totalStudents.set(response.data.students);
        this.totalChapters.set(response.data.chapters);
        this.totalUnits.set(response.data.units);
        this.totalVideos.set(response.data.videos);
        this.totalExercises.set(response.data.exercises);
      },
      error: (error) => {
        console.error('Erro ao carregar dados do dashboard:', error);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  formatDate(date: Date | undefined): string {
    const formattedDate =
      date !== null
        ? dayjs(date).format('DD/MM/YY - HH:mm:ss')
        : 'Sem login realizado';

    return formattedDate;
  }

  getUserProgress(user: User): {
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
}
