import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-title',
  imports: [RouterLink],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
})
export class TitleComponent {
  title = input<string>('');
  link = input<string>('');
  activeBtn = input<boolean>(false);
  btnLabel = input<string>('');
}
