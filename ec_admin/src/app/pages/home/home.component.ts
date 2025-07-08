import { Component, OnInit, signal } from '@angular/core';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { TitleComponent } from '../../components/title/title.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [InfoCardComponent, TitleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  totalStudents = signal<number>(0);
  totalUnits = signal<number>(0);
  totalVideos = signal<number>(0);
  totalExercises = signal<number>(0);

  constructor(private readonly httpClient: HttpClient) {}

  ngOnInit(): void {
    const users = this.httpClient.get<{ message: string; data: any[] }>(
      'http://localhost:3000/api/users?students=true',
      {
        withCredentials: true,
      },
    );

    users.subscribe({
      next: (response) => {
        this.totalStudents.set(response.data.length);
      },
      error: (error) => {
        console.log(error);
      },
    });

    const units = this.httpClient.get<{ message: string; data: any[] }>(
      'http://localhost:3000/api/units',
      {
        withCredentials: true,
      },
    );

    units.subscribe({
      next: (response) => {
        this.totalUnits.set(response.data.length);
      },
      error: (error) => {
        console.log(error);
      },
    });

    const videos = this.httpClient.get<{ message: string; data: any[] }>(
      'http://localhost:3000/api/videos',
      {
        withCredentials: true,
      },
    );

    videos.subscribe({
      next: (response) => {
        this.totalVideos.set(response.data.length);
      },
      error: (error) => {
        console.log(error);
      },
    });

    const exercises = this.httpClient.get<{ message: string; data: any[] }>(
      'http://localhost:3000/api/exercises',
      {
        withCredentials: true,
      },
    );

    exercises.subscribe({
      next: (response) => {
        this.totalExercises.set(response.data.length);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
