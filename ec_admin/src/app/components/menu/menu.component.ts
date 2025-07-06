import { Component, input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  isSubMenuOpen = signal<boolean>(false);
  subMenuRoutes = signal<string[]>([
    '/contents/chapters',
    '/contents/units',
    '/contents/media',
  ]);

  handleClick(): void {
    this.isSubMenuOpen.set(!this.isSubMenuOpen());
  }
}
