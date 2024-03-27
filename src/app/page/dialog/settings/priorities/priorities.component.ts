import {Component, EventEmitter, input, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Priority} from "../../../../dto/Priority";
import {MatDialog} from "@angular/material/dialog";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DeviceDetectorService} from "ngx-device-detector";
import {DialogAction} from "../../../../model/DialogResult";
import {ConfirmComponent} from "../../confirm/confirm.component";
import {EditPriorityComponent} from "../../edit-priority/edit-priority.component";

@Component({
  selector: 'app-priorities',
  standalone: true,
  imports: [
    NgForOf, MatIconModule, NgIf, TranslateModule
  ],
  templateUrl: './priorities.component.html',
  styleUrl: './priorities.component.css'
})
export class PrioritiesComponent {
  static readonly defaultColor = '#fcfcfc';

  priorities = input.required<Priority[]>();

  @Output() deletePriorityEvent = new EventEmitter<Priority>();
  @Output() updatePriorityEvent = new EventEmitter<Priority>();
  @Output() addPriorityEvent = new EventEmitter<Priority>();

  isMobile: boolean;

  constructor(private dialog: MatDialog,
              private translate: TranslateService,
              private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EditPriorityComponent,
      {
        width: '400px',
        data: {
          dialogTitle: this.translate.instant('COMMON.CONFIRM'),
          priority: new Priority("", PrioritiesComponent.defaultColor),
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.SAVE) {
        const newPriority = result.obj as Priority;
        this.addPriorityEvent.emit(newPriority);
      }
    });
  }

  openEditDialog(priority: Priority): void {

    const dialogRef = this.dialog.open(EditPriorityComponent, {
      data: {
        dialogTitle: this.translate.instant('PRIORITY.EDITING'),
        priority: new Priority(priority.title, priority.color, priority.id),
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) { // если просто закрыли окно, ничего не нажав
        return;
      }
      if (result.action === DialogAction.DELETE) {
        this.deletePriorityEvent.emit(priority);
        return;
      }
      if (result.action === DialogAction.SAVE) {
        priority = result.obj as Priority; // получить отредактированный объект
        this.updatePriorityEvent.emit(priority);
      }
    });
  }

  openDeleteDialog(priority: Priority): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: this.translate.instant('COMMON.CONFIRM'),
        message: this.translate.instant('PRIORITY.CONFIRM-DELETE', {name: priority.title})
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.OK) {
        this.deletePriorityEvent.emit(priority);
      }
    });
  }

}
