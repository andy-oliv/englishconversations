import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-users',
  imports: [MenuComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {}
