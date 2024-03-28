import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-abaut',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    TranslateModule,
    MatButton
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  dialogTitle: string;
  message: string;

  constructor(private dialogRef: MatDialogRef<AboutComponent>,
              @Inject(MAT_DIALOG_DATA) private data: { dialogTitle: string, message: string }) {
    this.dialogTitle = data.dialogTitle;
    this.message = data.message;
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
