import {Component, input} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [
    NgIf,
    TranslateModule
  ],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
  iconName = input.required<string>();
  count1 = input.required<number | string | null>();
  count2 = input.required<number | null>();
  title = input.required<string>();

}
