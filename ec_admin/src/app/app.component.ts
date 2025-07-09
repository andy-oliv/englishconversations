import { Component, computed, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { MenuStateService } from './services/menu-state.service';
import { NgClass } from '@angular/common';
import { filter } from 'rxjs';
import { UserStateService } from './services/user-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  currentRoute = signal<string>('');
  isMenuOpen = computed(() => this.menuState.isMenuOpen());
  constructor(
    private readonly menuState: MenuStateService,
    private readonly router: Router,
    private readonly userService: UserStateService,
  ) {}

  ngOnInit() {
    const loadedUser: string | null = localStorage.getItem('user');
    if (loadedUser) {
      this.userService.setLoggedUser(JSON.parse(loadedUser));
    }

    this.currentRoute.set(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute.set(event.urlAfterRedirects);
      });
  }
}
