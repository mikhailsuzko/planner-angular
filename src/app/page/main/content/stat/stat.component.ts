import {Component, effect, input} from '@angular/core';
import {DashboardData} from "../../../../model/DashboardData";
import {TranslateModule} from "@ngx-translate/core";
import {PercentPipe} from "@angular/common";
import {StatCardComponent} from "./stat-card/stat-card.component";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [
    TranslateModule,
    PercentPipe,
    StatCardComponent
  ],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.css',
  animations: [
    trigger('statRegion', [
      state('show', style({
        overflow: 'hidden',
        height: '*',
        opacity: '10',
      })),
      state('hide', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
      })),
      transition('* => *', animate('300ms ease-in-out'))
    ])
  ]
})
export class StatComponent {
  animationState!: string;
  dash = input.required<DashboardData>();
  showStatistics = input.required<boolean>();

  constructor() {
    effect(() => {
      this.initStatDash();
    })
  }


  getTotal(): number {
    return this.dash() ? this.dash().completedTotal + this.dash().uncompletedTotal : 0;
  }

  getCompletedCount(): number {
    return this.dash() ? this.dash().completedTotal : 0;
  }

  getUncompletedCount(): number {
    return this.dash() ? this.dash().uncompletedTotal : 0;
  }

  getCompletedPercent(): number {
    return this.dash() ? (this.dash().completedTotal / this.getTotal()) : 0;
  }

  getUncompletedPercent(): number {
    return this.dash() ? (this.dash().uncompletedTotal / this.getTotal()) : 0;
  }

  initStatDash(): void {
    if (this.showStatistics()) {
      this.animationState = 'show';
    } else {
      this.animationState = 'hide';
    }
  }

}
