import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-settings',
  imports: [MenuComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
