import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {UserProfile} from "../../dto/DtoObjects";
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
import {CategorySearchValues} from "../../dao/search/SearchObjects";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {HeaderComponent} from "./content/header/header.component";
import {DashboardData} from "../../model/DashboardData";
import {Stat} from "../../dto/Stat";
import {StatComponent} from "./content/stat/stat.component";

export const LANG_RU = 'ru';
export const LANG_EN = 'en';


@Component({
  selector: 'app-data',
  standalone: true,
  imports: [
    NgIf, NgClass, CategoriesComponent,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, HeaderComponent, StatComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {

  userProfile!: UserProfile;
  priorities!: Priority[];
  categories!: Category[];
  tasks!: Task[];
  value = 'Clear me';

  isMobile: boolean = false;
  isTablet: boolean = false;
  isLoading: boolean = false;

  dash: DashboardData = new DashboardData(0, 0);
  stat = new Stat(0, 2);
  showStat = true;
  showSearch = false;
  selectedCategory!: Category;

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

  private exchangeRefreshToken() {
    console.log("MainComponent -> exchangeRefreshToken");
    this.http.get(environment.bffUrl + '/exchange').subscribe(
      {
        next: (() => {
          this.requestUserData();
        }),
        error: (error => {
          console.log(error);
          this.redirectToLogin();
        })
      }
    );
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
      error: (error) => {
        console.log("requestPriorities -> error: " + error);
        this.exchangeRefreshToken();
      }
    })
  }

  private requestCategories() {
    this.categoryService.findAll().subscribe({
      next: (response => {
        this.categories = response;
        console.log("requestCategories -> response: " + response);
      }),
      error: (error) => {
        console.log("requestCategories -> error: " + error);
        this.exchangeRefreshToken();
      }
    })
  }

  addCategory(category: Category): void {
    this.categoryService.add(category).subscribe(result => {
        console.log(result);
        this.requestCategories();
      }
    );
  }

  updateCategory(category: Category): void {
    this.categoryService.update(category).subscribe(result => {
        console.log(result);
        this.requestCategories();
      }
    );
  }

  deleteCategory(category: Category): void {
    this.categoryService.delete(category.id!).subscribe(result => {
        console.log(result);
        this.requestCategories();
      }
    );
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

  }

  toggleStat(showStat: boolean): void {
    this.showStat = showStat;
  }
}
