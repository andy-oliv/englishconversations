import { Component, input } from '@angular/core';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-title',
  imports: [UserComponent],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
})
export class TitleComponent {
  title = input<string>('');
}
