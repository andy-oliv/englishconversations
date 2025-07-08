import { Component } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';

@Component({
  selector: 'app-media',
  imports: [TitleComponent],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss',
})
export class MediaComponent {}
