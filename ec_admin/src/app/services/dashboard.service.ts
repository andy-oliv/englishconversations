import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Dashboard } from '../../schemas/dashboardData.schema';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private readonly httpClient: HttpClient) {}

  fetchDashboardData(): Observable<{ message: string; data: Dashboard }> {
    return this.httpClient.get<{ message: string; data: Dashboard }>(
      `${environment.apiUrl}/dashboard`,
      {
        withCredentials: true,
      },
    );
  }
}
