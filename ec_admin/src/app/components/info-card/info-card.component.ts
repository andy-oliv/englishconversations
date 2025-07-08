import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-info-card',
  imports: [],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss',
})
export class InfoCardComponent {
  legend = input<string>('');
  value = input<number>(0);
  cardColor = input<string>('#ffbb80');
  valueColor = input<string>('#000000');
  legendColor = input<string>('#000000');
}
