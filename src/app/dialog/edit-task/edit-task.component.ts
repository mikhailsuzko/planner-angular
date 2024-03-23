import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {DeviceDetectorService} from "ngx-device-detector";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Category} from "../../dto/Category";
import {Priority} from "../../dto/Priority";
import {DialogAction, DialogResult} from "../../model/DialogResult";
import {Task} from '../../dto/Task';
import {ConfirmComponent} from "../confirm/confirm.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    TranslateModule, MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSelectModule, MatDatepickerModule,
    NgIf, NgForOf, NgClass
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      task: Task,
      title: string,
      categories: Category[],
      priorities: Priority[]
    },
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private translateService: TranslateService
  ) {
  }

  categories!: Category[];
  priorities!: Priority[];

  isMobile = this.deviceService.isMobile();

  dialogTitle!: string;
  task!: Task;

  newTitle!: string;
  newPriorityId!: number;
  newCategoryId!: number;
  newDate!: Date | null;
  oldCategoryId!: number;

  canDelete = false;

  today = new Date();

  ngOnInit(): void {
    this.task = this.data.task;
    this.dialogTitle = this.data.title;
    this.categories = this.data.categories;
    this.priorities = this.data.priorities;

    this.canDelete = this.task && this.task.id !== null;

    this.newTitle = this.task.title;

    if (this.task.priority) {
      this.newPriorityId = this.task.priority.id;
    }

    if (this.task.category) {
      this.newCategoryId = this.task.category.id!;
      this.oldCategoryId = this.task.category.id!;
    }

    if (this.task.taskDate) {
      this.newDate = new Date(this.task.taskDate);
    }
  }

  confirm(): void {
    if (!this.newTitle || this.newTitle.trim().length === 0) {
      return;
    }
    this.task.title = this.newTitle;
    this.task.priority = this.findPriorityById(this.newPriorityId);
    this.task.category = this.findCategoryById(this.newCategoryId);
    this.task.oldCategory = this.findCategoryById(this.oldCategoryId);
    if (!this.newDate) {
      this.task.taskDate = undefined;
    } else {
      this.task.taskDate = this.newDate;
    }
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.task));
  }

  cancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: this.translateService.instant('COMMON.CONFIRM'),
        message: this.translateService.instant('TASKS.CONFIRM-DELETE', {name: this.task.title})
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

  complete(): void {
    this.dialogRef.close(new DialogResult(DialogAction.COMPLETE));
  }

  activate(): void {
    this.dialogRef.close(new DialogResult(DialogAction.ACTIVATE));
  }

  private findPriorityById(tmpPriorityId: number): Priority {
    return this.priorities.find(t => t.id === tmpPriorityId)!;
  }

  private findCategoryById(tmpCategoryId: number): Category {
    return this.categories.find(t => t.id === tmpCategoryId)!;
  }

  addDays(days: number): void {
    this.newDate = new Date();
    this.newDate.setDate(this.today.getDate() + days);
  }

  setToday(): void {
    this.newDate = this.today;
  }
}
