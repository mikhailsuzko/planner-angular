import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AboutComponent} from "../../../dialog/about/about.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    TranslateModule,
    DatePipe
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})

export class FooterComponent {
  year: Date = new Date();
  siteName = 'SoftMobile';

  constructor(private dialog: MatDialog,
              private translate: TranslateService) {
  }

  openAboutDialog(): void {
    this.dialog.open(AboutComponent,
      {
        autoFocus: false,
        data: {
          dialogTitle: 'О программе',
          message: this.translate.instant('COMMON.ABOUT-DETAILS')
        },
        width: '400px'
      });
  }
}
