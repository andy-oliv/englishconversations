import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuStateService } from '../../services/menu-state.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  openSubMenu = signal<boolean>(false);
  closeSubMenu = signal<boolean>(true);
  noSubMenuAnimation = signal<boolean>(false);
  closeMenu = signal<boolean>(false);
  noMenuAnimation = signal<boolean>(false);
  toggleContentStyle = signal<boolean>(false);

  constructor(
    private router: Router,
    private menuState: MenuStateService,
  ) {}

  ngOnInit(): void {
    if (!this.menuState.isMenuOpen()) {
      this.closeMenu.set(true);
      this.noMenuAnimation.set(true);
    }

    const checkContentRoute = (url: string) => {
      if (url.startsWith('/content')) {
        this.toggleContentStyle.set(true);
        this.openSubMenu.set(true);
        this.noSubMenuAnimation.set(true); //prevents openSubMenu animation when loading a "/content/.." page
      }
    };

    checkContentRoute(this.router.url);
  }

  handleClick(): void {
    this.noSubMenuAnimation.set(false); //makes sure animations are working again when in a "/content/.." page
    this.openSubMenu.set(!this.openSubMenu());
  }

  handleMenuClick(): void {
    this.noMenuAnimation.set(false);
    this.closeMenu.set(!this.closeMenu());
    this.menuState.isMenuOpen.set(!this.closeMenu());
  }
}
