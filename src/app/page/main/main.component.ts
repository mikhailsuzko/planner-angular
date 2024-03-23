import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {UserProfile} from "../../dto/UserProfile";
import {NgClass, NgIf} from "@angular/common";
import {PriorityService} from "../../dao/impl/PriorityService";
import {Priority} from "../../dto/Priority";
import {TaskService} from "../../dao/impl/TaskService";
import {CategoryService} from "../../dao/impl/CategoryService";
import {StatService} from "../../dao/impl/StatService";
import {Category} from "../../dto/Category";
import {Task} from "../../dto/Task";
import {DeviceDetectorService} from "ngx-device-detector";
import {CategoriesComponent} from "./sidebar/categories/categories.component";
import {TranslateService} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {CategorySearchValues, TaskSearchValues} from "../../model/search/SearchObjects";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {HeaderComponent} from "./content/header/header.component";
import {DashboardData} from "../../model/DashboardData";
import {Stat} from "../../dto/Stat";
import {StatComponent} from "./content/stat/stat.component";
import {Page} from "../../model/Page";
import {TasksComponent} from "./content/tasks/tasks.component";
import {PageEvent} from "@angular/material/paginator";

export const LANG_RU = 'ru';
export const LANG_EN = 'en';


@Component({
  selector: 'app-data',
  standalone: true,
  imports: [
    NgIf, NgClass, CategoriesComponent,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, HeaderComponent, StatComponent, TasksComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {

  userProfile!: UserProfile;
  priorities!: Priority[];
  categories!: Category[];
  tasks!: Task[];

  isMobile: boolean = false;
  isTablet: boolean = false;

  dash: DashboardData = new DashboardData(0, 0);
  stat = new Stat(0, 0);
  showStat = true;
  selectedCategory!: Category;

  taskSearchValues: TaskSearchValues = new TaskSearchValues();
  totalTaskFound = 0;
  showSearch = false;

  constructor(private http: HttpClient,
              private router: Router,
              private taskService: TaskService,
              private categoryService: CategoryService,
              private priorityService: PriorityService,
              private statService: StatService,
              private deviceService: DeviceDetectorService,
              translateService: TranslateService
  ) {
    translateService.setDefaultLang(LANG_RU)
    translateService.use(LANG_RU)
  }

  showSidebar: boolean = true;

  toggleMenu(showSidebar: boolean) {
    this.showSidebar = showSidebar;
  }

  ngOnInit(): void {
    console.log("MainComponent -> ngOnInit");
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();

    window.history.pushState({}, "", document.location.href.split("?")[0]);
    this.requestUserData();
  }

  private requestUserData(): void {
    console.log("MainComponent -> requestUserData");
    this.requestUserProfile();
    this.requestCategories();
    this.requestPriorities();
    this.updateOverallStat();
    this.searchTasks(this.taskSearchValues);
  }

  private requestUserProfile(): void {
    console.log("MainComponent - requestUserProfile");
    this.http.get<UserProfile>(environment.bffUrl + '/profile').subscribe(
      {
        next: ((response: UserProfile) => {
          this.userProfile = response;
        }),
        error: (error => {
          console.log(error);
          this.redirectToLogin();
        })
      }
    );
  }

  private exchangeRefreshToken(callback: Function): void {
    console.log("MainComponent -> exchangeRefreshToken");
    this.http.get(environment.bffUrl + '/exchange').subscribe({
      next: res => {
        console.log("exchangeRefreshToken -> success");
        callback();
      },
      error: (error => {
        console.log("exchangeRefreshToken -> error: " + error.status + ": " + error.message);
        this.redirectToLogin();
      })
    });
  }

  private redirectToLogin() {
    console.log("MainComponent -> redirectToLogin");
    this.router.navigate(['/login']);
  }

  logout() {
    console.log("MainComponent -> logout");
    this.http.get(environment.bffUrl + '/logout').subscribe({
        next: (() => {
          this.redirectToLogin();
        }),
        error: (error => {
          console.log(error);
          this.redirectToLogin();
        })
      }
    );
  }

  private requestPriorities() {
    this.priorityService.findAll().subscribe({
      next: (response => {
        this.priorities = response;
        console.log("requestPriorities -> response: " + response);
      }),
      error: (error => {
        this.processError("requestPriorities", error, () => this.requestPriorities());
      })
    })
  }

  processError(method: string, error: any, callback: Function) {
    console.log(method + " -> error: " + error.status + ": " + error.message);
    if (error && error.status === 403) {
      this.exchangeRefreshToken(callback);
    }
  }

  private requestCategories() {
    this.categoryService.findAll().subscribe({
      next: (response => {
        this.categories = response;
        console.log("requestCategories -> response: " + response);
      }),
      error: (error => {
        this.processError("requestCategories", error, () => this.requestCategories())
      })
    })
  }

  addCategory(category: Category): void {
    this.categoryService.add(category).subscribe({
        next: (result => {
          console.log("Category '" + category.title + "' is added");
          this.requestCategories();
        }),
        error: (error => {
          this.processError("addCategory", error, () => this.addCategory(category))
        })
      }
    );
  }

  updateCategory(category: Category): void {
    this.categoryService.update(category).subscribe({
        next: (result => {
          console.log("Category '" + category.title + "' is updated");
          this.requestCategories();
        }),
        error: (error => {
          this.processError("updateCategory", error, () => this.updateCategory(category))
        })
      }
    );
  }

  deleteCategory(category: Category): void {
    this.categoryService.delete(category.id!).subscribe({
      next: (result => {
        console.log("Category '" + category.title + "' is deleted");
        this.requestCategories();
      }),
      error: (error => {
        this.processError("deleteCategory", error, () => this.deleteCategory(category))
      })
    });
  }

  searchCategory(categorySearchValues: CategorySearchValues): void {
    if (categorySearchValues.title.trim().length == 0) {
      this.requestCategories();
    } else {
      this.categoryService.findCategories(categorySearchValues).subscribe(result => {
        this.categories = result;
      });
    }
  }

  categorySelected(category: Category) {
    console.log(category);
    this.selectedCategory = category;

    if (category && category.id) {
      this.dash.completedTotal = category.completedCount;
      this.dash.uncompletedTotal = category.uncompletedCount;
    } else {
      this.dash.completedTotal = this.stat.completedTotal;
      this.dash.uncompletedTotal = this.stat.uncompletedTotal;
    }

    this.taskSearchValues.pageNumber = 0;
    this.taskSearchValues.categoryId = category.id;

    this.searchTasks(this.taskSearchValues);
  }

  toggleStat(showStat: boolean): void {
    this.showStat = showStat;
  }

  searchTasks(searchTaskValues: TaskSearchValues) {
    this.taskService.findTasks(this.taskSearchValues).subscribe({
      next: ((result: Page<Task>) => {
        console.log("searchTasks -> totalElements: " + result.totalElements);
        this.totalTaskFound = result.totalElements;
        this.tasks = result.content;
        console.log("searchTasks -> tasks: " + this.tasks);
      }),
      error: (error => {
        this.processError("searchTasks", error, () => this.searchTasks(searchTaskValues));
      })
    });
  }



  private updateCategoryStat(category: Category) {
    this.categoryService.findById(category.id ?? 0).subscribe({
      next: (cat: Category) => {
        const tmpCategory = this.categories.find(c => c.id = cat.id);
        if (tmpCategory) {
          this.categories[this.categories.indexOf(tmpCategory)] = cat;
        }
        if (this.selectedCategory && this.selectedCategory.id === cat.id) {
          this.dash.uncompletedTotal = cat.uncompletedCount;
          this.dash.completedTotal = cat.completedCount;
        }
      },
      error: (error => {
        this.processError("updateCategoryStat", error, () => this.updateCategoryStat(category))
      })
    });
  }

  private updateOverallStat() {
    this.statService.getOverallStat().subscribe({
      next: (stat: Stat) => {
        this.stat = stat;
        if (!this.selectedCategory) {
          this.dash.completedTotal = stat.completedTotal;
          this.dash.uncompletedTotal = stat.uncompletedTotal;
        }
      },
      error: (error => {
        this.processError("updateOverallStat", error, () => this.updateOverallStat())
      })
    })
  }

  updateTask(task: Task) {
    this.taskService.update(task).subscribe({
      next: () => {
        console.log("Task '" + task.title + "' is updated");
        this.updateCategoriesStatAndTasks(task);
      },
      error: (error => {
        this.processError("updateTask", error, () => this.updateTask(task))
      })
    });
  }

  addTask(task: Task) {
    this.taskService.add(task).subscribe({
      next: () => {
        console.log("Task '" + task.title + "' is added");
        this.updateCategoriesStatAndTasks(task);
      },
      error: (error => {
        this.processError("addTask", error, () => this.addTask(task))
      })
    });
  }

  deleteTask(task: Task) {
    this.taskService.delete(task.id!).subscribe({
      next: () => {
        console.log("Task '" + task.title + "' is deleted");
        this.updateCategoriesStatAndTasks(task);
      },
      error: (error => {
        this.processError("deleteTask", error, () => this.deleteTask(task))
      })
    });

  }

  private updateCategoriesStatAndTasks(task: Task) {
    if (task.category) {
      this.updateCategoryStat(task.category);
    }
    if (task.oldCategory) {
      this.updateCategoryStat(task.oldCategory);
    }
    this.updateOverallStat();
    // this.requestCategories();
    this.searchTasks(this.taskSearchValues);
  }

  paging(pageEvent: PageEvent) {
    if (this.taskSearchValues.pageSize !== pageEvent.pageSize) {
      this.taskSearchValues.pageNumber = 0;
      this.taskSearchValues.pageSize = pageEvent.pageSize;
    } else {
      this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.searchTasks(this.taskSearchValues);
  }

  toggleSearch(showSearch: boolean): void {
    this.showSearch = showSearch;
  }

}
