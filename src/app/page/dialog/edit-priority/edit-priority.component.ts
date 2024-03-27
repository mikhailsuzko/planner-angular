import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Priority} from "../../../dto/Priority";
import {DialogAction, DialogResult} from "../../../model/DialogResult";
import {ConfirmComponent} from "../confirm/confirm.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ColorPickerModule} from 'ngx-color-picker';

@Component({
  selector: 'app-edit-priority',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, TranslateModule, FormsModule,
    MatInputModule, MatIconModule, MatButtonModule, ColorPickerModule, NgIf],
  templateUrl: './edit-priority.component.html',
  styleUrl: './edit-priority.component.css'
})
export class EditPriorityComponent {
  dialogTitle: string;
  priority: Priority;
  canDelete: boolean;

  constructor(
    private dialogRef: MatDialogRef<EditPriorityComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      priority: Priority,
      dialogTitle: string
    },
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.priority = data.priority;
    this.dialogTitle = data.dialogTitle;
    this.canDelete = this.priority && this.priority.id! > 0;
  }

  confirm(): void {
    if (!this.priority.title || this.priority.title.trim().length === 0) {
      return;
    }
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.priority));
  }

  cancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: this.translate.instant('COMMON.CONFIRM'),
        message: this.translate.instant('PRIORITY.CONFIRM-DELETE', {name: this.priority.title})
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.OK) {
        this.dialogRef.close(new DialogResult(DialogAction.DELETE));
      }
    });
  }
}
