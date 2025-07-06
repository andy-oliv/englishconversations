import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuStateService {
  isMenuOpen = signal<boolean>(true);
}
