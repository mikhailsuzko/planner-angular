import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {Category} from "../../../dto/Category";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {DialogAction, DialogResult} from "../../../model/DialogResult";
import {ConfirmComponent} from "../confirm/confirm.component";

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    MatButton,
    MatInput,
    MatDialogTitle,
    TranslateModule,
    NgIf,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit {
  canDelete: boolean = false;
  category!: Category;
  title: string;
  data!: { category: Category, action: string };

  constructor(public dialogRef: MatDialogRef<EditCategoryComponent>,
              public dialog: MatDialog,
              private translateService: TranslateService,
              @Inject(MAT_DIALOG_DATA) data: { category: Category, title: string }) {
    this.category = data.category;
    this.title = data.title;
  }

  ngOnInit(): void {
    if (this.category && this.category.id && this.category.id > 0) {
      this.canDelete = true;
    }
  }

  onNoClick() {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '400px',
      data: {
        dialogTitle: this.translateService.instant('COMMON.CONFIRM'),
        message: this.translateService.instant('CATEGORY.CONFIRM-DELETE', {name: this.category.title})
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: DialogResult) => {
      if (result && result.action === DialogAction.OK) {
        this.dialogRef.close(new DialogResult(DialogAction.DELETE, this.category));
      }
    });
  }

  save() {
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.category));
  }
}
