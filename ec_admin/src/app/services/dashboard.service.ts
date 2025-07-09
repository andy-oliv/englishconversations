import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { envinronment } from '../../environments/environment';
import DashboardData from '../../common/interfaces/dashboardData';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private readonly httpClient: HttpClient) {}

  fetchDashboardData(): Observable<{ message: string; data: DashboardData }> {
    return this.httpClient.get<{ message: string; data: DashboardData }>(
      `${envinronment.apiUrl}/dashboard`,
      {
        withCredentials: true,
      },
    );
  }
}
