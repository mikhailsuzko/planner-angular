import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {UserProfile} from "../../dto/UserProfile";
import {NgClass, NgIf} from "@angular/common";
import {TaskService} from "../../dao/impl/TaskService";
import {CategoryService} from "../../dao/impl/CategoryService";
import {StatService} from "../../dao/impl/StatService";
import {Category} from "../../dto/Category";
import {Task} from "../../dto/Task";
import {DeviceDetectorService} from "ngx-device-detector";
import {CategoriesComponent} from "./sidebar/categories/categories.component";
import {TranslateService} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {TaskSearchValues} from "../../model/search/SearchObjects";
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
import {CookieUtils} from "../../utils/CookieUtils";
import {CommonUtils} from "../../utils/CommonUtils";
import {TokenUtils} from "../../utils/TokenUtils";

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
  categories!: Category[];
  tasks!: Task[];

  isMobile: boolean = false;
  isTablet: boolean = false;

  dash: DashboardData = new DashboardData(0, 0);
  stat = new Stat(0, 0);
  showStat = true;
  emptyCategory = new Category('');
  selectedCategory: Category = this.emptyCategory;

  taskSearchValues: TaskSearchValues = new TaskSearchValues();
  totalTaskFound = 0;
  showSearch = false;

  cookiesUtils = new CookieUtils();
  readonly cookieTaskSearchValues = 'todo:searchValues';
  readonly cookieShowStat = 'todo:showStat';
  readonly cookieShowMenu = 'todo:showMenu';
  readonly cookieShowSearch = 'todo:showSearch';
  readonly cookieLang = 'todo:lang';


  constructor(private http: HttpClient,
              private commonUtils:CommonUtils,
              private tokenUtils:TokenUtils,
              private taskService: TaskService,
              private categoryService: CategoryService,
              private statService: StatService,
              private deviceService: DeviceDetectorService,
              private translateService: TranslateService
  ) {
    translateService.setDefaultLang(LANG_RU)
    translateService.use(LANG_RU)
  }

  showSidebar: boolean = true;

  toggleMenu(showSidebar: boolean) {
    this.showSidebar = showSidebar;
    this.cookiesUtils.setCookie(this.cookieShowMenu, String(this.showSidebar));
  }

  ngOnInit(): void {
    console.log("MainComponent -> ngOnInit");
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();

    this.initSidebar()
    this.initLangCookie();
    if (this.isMobile) {
      this.showStat = false;
    } else {
      this.initShowStatCookie();
    }
    this.initShowSearchCookie();

    window.history.pushState({}, "", document.location.href.split("?")[0]);
    this.requestUserProfile();
    this.requestCategories(true);
    this.updateOverallStat();
  }

  initSidebar(): void {
    if (this.isMobile) {
      this.showSidebar = false;
    } else {
      this.initShowMenuCookie();
    }
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
          this.tokenUtils.redirectToLogin();
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
        this.tokenUtils.redirectToLogin();
      })
    });
  }


  logout() {
    console.log("MainComponent -> logout");
    this.http.get(environment.bffUrl + '/logout').subscribe({
        next: (() => {
          this.tokenUtils.redirectToLogin();
        }),
        error: (error => {
          console.log(error);
          this.tokenUtils.redirectToLogin();
        })
      }
    );
  }


  private requestCategories(init: boolean = false) {
    this.categoryService.findAll().subscribe({
      next: (response => {
        this.categories = response;
        if (init) {
          this.initSearchCookie();
          this.categorySelected(this.selectedCategory);
        }
        console.log("requestCategories -> response: " + response);
      }),
      error: (error => {
        this.commonUtils.processError("requestCategories", error, () => this.requestCategories())
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
          this.commonUtils.processError("addCategory", error, () => this.addCategory(category))
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
          this.commonUtils.processError("updateCategory", error, () => this.updateCategory(category))
        })
      }
    );
  }

  deleteCategory(category: Category): void {
    if (this.selectedCategory && category.id === this.selectedCategory.id) {
      this.selectedCategory = this.emptyCategory;
      this.taskSearchValues.categoryId = null;
      this.searchTasks(this.taskSearchValues);
    }
    this.categoryService.delete(category.id!).subscribe({
      next: (result => {
        console.log("Category '" + category.title + "' is deleted");
        this.requestCategories();
      }),
      error: (error => {
        this.commonUtils.processError("deleteCategory", error, () => this.deleteCategory(category))
      })
    });
  }

  categorySelected(category: Category) {
    console.log(category);
    this.selectedCategory = category;

    if (category && category.id) {
      this.taskSearchValues.categoryId = category.id;
      this.dash.completedTotal = category.completedCount;
      this.dash.uncompletedTotal = category.uncompletedCount;
    } else {
      this.taskSearchValues.categoryId = null;
      this.dash.completedTotal = this.stat.completedTotal;
      this.dash.uncompletedTotal = this.stat.uncompletedTotal;
    }

    this.taskSearchValues.pageNumber = 0;

    this.searchTasks(this.taskSearchValues);
  }

  toggleStat(showStat: boolean): void {
    this.showStat = showStat;
    this.cookiesUtils.setCookie(this.cookieShowStat, String(showStat));
  }

  searchTasks(searchTaskValues: TaskSearchValues) {
    this.cookiesUtils.setCookie(this.cookieTaskSearchValues, JSON.stringify(this.taskSearchValues));
    this.taskService.findTasks(this.taskSearchValues).subscribe({
      next: ((result: Page<Task>) => {
        console.log("searchTasks -> totalElements: " + result.totalElements);
        this.totalTaskFound = result.totalElements;
        this.tasks = result.content;
        console.log("searchTasks -> tasks: " + this.tasks);
      }),
      error: (error => {
        this.commonUtils.processError("searchTasks", error, () => this.searchTasks(searchTaskValues));
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
        this.commonUtils.processError("updateCategoryStat", error, () => this.updateCategoryStat(category))
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
        this.commonUtils.processError("updateOverallStat", error, () => this.updateOverallStat())
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
        this.commonUtils.processError("updateTask", error, () => this.updateTask(task))
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
        this.commonUtils.processError("addTask", error, () => this.addTask(task))
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
        this.commonUtils.processError("deleteTask", error, () => this.deleteTask(task))
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
    this.cookiesUtils.setCookie(this.cookieShowSearch, String(showSearch));
  }

  initSearchCookie(): boolean {
    const cookie = this.cookiesUtils.getCookie(this.cookieTaskSearchValues);
    if (!cookie) {
      return false;
    }

    const cookieJSON = JSON.parse(cookie);
    if (!cookieJSON) {
      return false;
    }

    if (!this.taskSearchValues) {
      this.taskSearchValues = new TaskSearchValues();
    }
    const tmpPageSize = cookieJSON.pageSize;
    if (tmpPageSize) {
      this.taskSearchValues.pageSize = Number(tmpPageSize);
    }
    const tmpCategoryId = cookieJSON.categoryId;
    if (tmpCategoryId) {
      this.taskSearchValues.categoryId = Number(tmpCategoryId);
      this.selectedCategory = this.getCategoryFromArray(tmpCategoryId);
    }
    const tmpPriorityId = cookieJSON.priorityId as number;
    if (tmpPriorityId) {
      this.taskSearchValues.priorityId = Number(tmpPriorityId);
    }
    const tmpTitle = cookieJSON.title;
    if (tmpTitle) {
      this.taskSearchValues.title = tmpTitle;
    }
    const tmpCompleted = cookieJSON.completed as boolean;
    if (tmpCompleted) {
      this.taskSearchValues.completed = tmpCompleted;
    }
    const tmpSortColumn = cookieJSON.sortColumn;
    if (tmpSortColumn) {
      this.taskSearchValues.sortColumn = tmpSortColumn;
    }
    const tmpSortDirection = cookieJSON.sortDirection;
    if (tmpSortDirection) {
      this.taskSearchValues.sortDirection = tmpSortDirection;
    }
    const tmpDateFrom = cookieJSON.dateFrom;
    if (tmpDateFrom) {
      this.taskSearchValues.dateFrom = new Date(tmpDateFrom);
    }
    const tmpDateTo = cookieJSON.dateTo;
    if (tmpDateTo) {
      this.taskSearchValues.dateTo = new Date(tmpDateTo);
    }
    return true;
  }

  getCategoryFromArray(id: number): Category {
    return this.categories.find(t => t.id === id)!;
  }

  initShowSearchCookie(): void {
    const val = this.cookiesUtils.getCookie(this.cookieShowSearch);
    if (val) {
      this.showSearch = (val === 'true');
    }

  }

  initShowStatCookie(): void {
    if (!this.isMobile) {
      const val = this.cookiesUtils.getCookie(this.cookieShowStat);
      if (val) {
        this.showStat = (val === 'true');
      }
    }
  }

  initShowMenuCookie(): void {
    const val = this.cookiesUtils.getCookie(this.cookieShowMenu);
    if (val) {
      this.showSidebar = (val === 'true');
    }
  }

  initLangCookie(): void {
    const val = this.cookiesUtils.getCookie(this.cookieLang);
    if (val) {
      this.translateService.use(val);
    } else {
      this.translateService.use(LANG_RU);
    }
  }

  settingsChanged() {
    this.searchTasks(this.taskSearchValues);
    this.cookiesUtils.setCookie(this.cookieLang, this.translateService.currentLang);
  }
}
