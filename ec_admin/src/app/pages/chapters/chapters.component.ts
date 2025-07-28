import { Component, effect, OnInit, signal } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Chapter,
  ChapterSchema,
  ChaptersSchema,
} from '../../../schemas/chapter.schema';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-chapters',
  imports: [TitleComponent, RouterOutlet],
  templateUrl: './chapters.component.html',
  styleUrl: './chapters.component.scss',
})
export class ChaptersComponent implements OnInit {
  addChapterURL = signal<string>('/admin/content/chapters/add');
  currentUrl = signal<string>('');
  chapters = signal<Chapter[]>([]);
  status404 = signal<boolean>(false);

  constructor(
    private readonly router: Router,
    private readonly httpClient: HttpClient,
    private readonly logService: LogService,
  ) {
    effect(() => {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.currentUrl.set(event.urlAfterRedirects);
        });
    });
  }

  ngOnInit(): void {
    const subscription = this.httpClient.get<{
      message: string;
      data: unknown[];
    }>(`${environment.apiUrl}/chapters`, {
      withCredentials: true,
    });

    subscription.subscribe({
      next: (response) => {
        const parse = ChaptersSchema.safeParse(response.data);
        if (parse.success) {
          this.chapters.set(parse.data);
        } else {
          this.logService.logError('', parse.error.issues);
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.status404.set(true);
          this.logService.handleException(error, 'ChaptersComponent');
        } else {
          this.logService.handleException(error, 'ChaptersComponent');
        }
      },
    });
  }
}
