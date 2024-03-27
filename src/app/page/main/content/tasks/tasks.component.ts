import {Component, CUSTOM_ELEMENTS_SCHEMA, effect, EventEmitter, input, OnInit, Output} from '@angular/core';
import {Task} from '../../../../dto/Task';
import {Category} from "../../../../dto/Category";
import {TaskSearchValues} from "../../../../model/search/SearchObjects";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {DeviceDetectorService} from "ngx-device-detector";
import {TranslateModule, TranslateService, TranslationChangeEvent} from "@ngx-translate/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatSort} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatListItemMeta} from "@angular/material/list";
import {ConfirmComponent} from "../../../dialog/confirm/confirm.component";
import {DialogAction} from "../../../../model/DialogResult";
import {EditTaskComponent} from "../../../dialog/edit-task/edit-task.component";
import {Priority} from "../../../../dto/Priority";
import {TaskDatePipe} from "../../../../pipe/task-date.pipe";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule, MatDateRangeInput} from "@angular/material/datepicker";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {PriorityService} from "../../../../dao/impl/PriorityService";
import {CommonUtils} from "../../../../utils/CommonUtils";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    TranslateModule, NgClass, NgIf,
    MatTableModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatSort,
    MatListItemMeta, TaskDatePipe, MatPaginatorModule, MatFormFieldModule, FormsModule,
    MatInputModule, MatSelectModule, MatDateRangeInput, ReactiveFormsModule,
    MatDatepickerModule, NgForOf
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('searchRegion', [
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
      transition('* => *', animate('0ms ease-in-out'))
    ])
  ]
})
export class TasksComponent implements OnInit {
  readonly iconNameDown = 'arrow_downward';
  readonly iconNameUp = 'arrow_upward';

  readonly defaultSortColumn = 'completed';
  readonly defaultSortDirection = 'asc';

  readonly colorCompletedTask = '#F8F9FA';
  readonly colorWhite = '#fff';

  tasks = input.required<Task[]>();
  selectedCategory = input.required<Category>();
  taskSearchValues = input.required<TaskSearchValues>();
  categories = input.required<Category[]>();
  totalTasksFound = input.required<number>();
  priorities!: Priority[];

  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'completed'];
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>(); // источник данных для таблицы

  filterTitle?: string | null;
  filterCompleted?: boolean | null;
  filterPriorityId?: number | null;
  filterSortColumn!: string;
  filterSortDirection!: string;
  dateRangeForm!: FormGroup;

  isMobile: boolean;

  translateWithoutCategory?: string;
  translateWithoutPriority?: string;

  animationState!: string;
  showSearch = input.required<boolean>();

  sortIconName!: string;

  @Output() addTaskEvent = new EventEmitter<Task>();
  @Output() updateTaskEvent = new EventEmitter<Task>();
  @Output() deleteTaskEvent = new EventEmitter<Task>();
  @Output() pagingEvent = new EventEmitter<PageEvent>
  @Output() toggleSearchEvent = new EventEmitter<boolean>();
  @Output() searchActionEvent = new EventEmitter<TaskSearchValues>();

  get dateFrom(): AbstractControl {
    return this.dateRangeForm!.get('dateFrom')!;
  }

  get dateTo(): AbstractControl {
    return this.dateRangeForm!.get('dateTo')!;
  }

  constructor(private dialog: MatDialog,
              private deviceService: DeviceDetectorService,
              private translate: TranslateService,
              private commonUtils:CommonUtils,
              private priorityService: PriorityService) {
    this.isMobile = this.deviceService.isMobile();
    effect(() => {
      this.assignTableSource();
      this.initSearchValues();
      this.initAnimation();
    });
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: TranslationChangeEvent) => {
      this.initTranslations();
    });
    this.initDateRangeForm();
    this.requestPriorities();
  }

  private requestPriorities() {
    this.priorityService.findAll().subscribe({
      next: (response => {
        this.priorities = response;
        console.log("requestPriorities -> response: " + response);
      }),
      error: (error => {
        this.commonUtils.processError("requestPriorities", error, () => this.requestPriorities());
      })
    })
  }

  initDateRangeForm(): void {
    this.dateRangeForm = new FormGroup({
      dateFrom: new FormControl(),
      dateTo: new FormControl()
    });

    this.dateTo.valueChanges.subscribe(() => {
      this.initSearch()
    });
  }


  initTranslations(): void {
    this.translate.get(['TASKS.WITHOUT-CATEGORY', 'TASKS.WITHOUT-PRIORITY'])
      .subscribe((res: any) => {
        this.translateWithoutCategory = res['TASKS.WITHOUT-CATEGORY'];
        this.translateWithoutPriority = res['TASKS.WITHOUT-PRIORITY'];
      });
  }

  assignTableSource(): void {
    if (this.tasks()) {
      console.log("Tasks -> assignTableSource");
      this.dataSource.data = this.tasks();
    }
  }

  initSearchValues(): void {
    if (!this.taskSearchValues() || this.filterSortColumn) {
      return;
    }
    console.log("Tasks -> initSearchValues");
    this.filterTitle = this.taskSearchValues().title;
    this.filterCompleted = this.taskSearchValues().completed;
    this.filterPriorityId = this.taskSearchValues().priorityId;
    this.filterSortColumn = this.taskSearchValues().sortColumn;
    this.filterSortDirection = this.taskSearchValues().sortDirection;
    this.initSortDirectionIcon();
  }

  getPriorityColor(task: Task): string {
    if (task.completed) {
      return this.colorCompletedTask;
    }
    if (task.priority && task.priority.color) {
      return task.priority.color;
    }
    return this.colorWhite;
  }

  onToggleCompleted(task: Task) {
    task.completed = !task.completed;
    this.updateTaskEvent.emit(task);
  }

  openDeleteDialog(task: Task) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: this.translate.instant('COMMON.CONFIRM'),
        message: this.translate.instant('TASKS.CONFIRM-DELETE', {name: task.title})
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === DialogAction.OK) {
        this.deleteTaskEvent.emit(task);
      }
    })
  }

  editTask(task: Task) {
    this.openEditDialog(task, this.translate.instant('TASKS.EDITING'));
  }

  addNewTask(): void {
    const task = new Task(null, '', false, null, this.selectedCategory());
    this.openEditDialog(task, this.translate.instant('TASKS.ADDING'));
  }


  openEditDialog(task: Task, title: string) {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: {
        task: task,
        title: title,
        categories: this.categories(),
        priorities: this.priorities
      },
      autoFocus: false,
      maxHeight: '90vh',
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.DELETE) {
        this.deleteTaskEvent.emit(task);
      } else if (result.action === DialogAction.COMPLETE) {
        task.completed = true;
        this.updateTaskEvent.emit(task);
      } else if (result.action === DialogAction.ACTIVATE) {
        task.completed = false;
        this.updateTaskEvent.emit(task);
      } else if (result.action === DialogAction.SAVE) {
        if (task.id) {
          this.updateTaskEvent.emit(task);
        } else {
          this.addTaskEvent.emit(task);
        }
        return;
      }
    });
  }

  pageChanged(pageEvent: PageEvent) {
    this.pagingEvent.emit(pageEvent);
  }

  initSortDirectionIcon(): void {
    if (this.filterSortDirection === 'desc') {
      this.sortIconName = this.iconNameDown;
    } else {
      this.sortIconName = this.iconNameUp;
    }
  }


  changedSortDirection(): void {
    if (this.filterSortDirection === 'asc') {
      this.filterSortDirection = 'desc';
    } else {
      this.filterSortDirection = 'asc';
    }
    this.initSortDirectionIcon();
    if (this.filterSortColumn) {
      this.initSearch();
    }
  }

  clearSearchValues(): void {
    this.filterTitle = '';
    this.filterCompleted = null;
    this.filterPriorityId = null;
    this.filterSortColumn = this.defaultSortColumn;
    this.filterSortDirection = this.defaultSortDirection;
    this.clearDateRange();
  }

  clearDateRange(): void {
    this.dateFrom.setValue(null);
    this.dateTo.setValue(null);
  }

  onToggleSearch(): void {
    this.toggleSearchEvent.emit(!this.showSearch());
    this.initAnimation();
  }


  initSearch(): void {
    this.taskSearchValues().title = this.filterTitle;
    this.taskSearchValues().completed = this.filterCompleted;
    this.taskSearchValues().priorityId = this.filterPriorityId;
    this.taskSearchValues().sortColumn = this.filterSortColumn!;
    this.taskSearchValues().sortDirection = this.filterSortDirection;
    let date = this.dateFrom.value;
    if (!date) {
      this.taskSearchValues().dateFrom = undefined;
    } else {
      date.setHours(0, 0, 0, 0)
      this.taskSearchValues().dateFrom = date;
    }
    date = this.dateTo.value;
    if (!date) {
      this.taskSearchValues().dateTo = undefined;
    } else {
      date.setHours(23, 59, 59, 999)
      this.taskSearchValues().dateTo = date;
    }
    this.searchActionEvent.emit(this.taskSearchValues());
  }

  initAnimation(): void {
    if (this.showSearch()) {
      this.animationState = 'show';
    } else {
      this.animationState = 'hide';
    }
  }


}
