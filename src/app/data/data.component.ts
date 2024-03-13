import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {DataResult, SearchValues, UserProfile} from "../dto/DtoObjects";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent implements OnInit {
  dataResult!: DataResult;
  userProfile!: UserProfile;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log("DataComponent -> ngOnInit");
    window.history.pushState({}, "", document.location.href.split("?")[0]);
    this.requestUserData();
  }

  private requestUserData(): void {
    console.log("DataComponent -> requestUserData");
    const searchText = new SearchValues("текст для поиска");
    const body = JSON.stringify(searchText);
    this.http.post<DataResult>(environment.bffURI + '/data', body, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe(
      {
        next: ((response: DataResult) => {
          this.dataResult = response;
          this.requestUserProfile();
        }),
        error: (error => {
          console.log(error);
          this.exchangeRefreshToken();
        })
      }
    );
  }

  private requestUserProfile(): void {
    console.log("DataComponent - requestUserProfile");
    this.http.get<UserProfile>(environment.bffURI + '/profile').subscribe(
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
    console.log("DataComponent -> exchangeRefreshToken");
    this.http.get(environment.bffURI + '/exchange').subscribe(
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
    console.log("DataComponent -> redirectToLogin");
    this.router.navigate(['/login']);
  }

  logout() {
    console.log("DataComponent -> logout");
    this.http.get(environment.bffURI + '/logout').subscribe({
        next: (() => {
          this.redirectToLogin();
        }),
        error: (error => {
          console.log(error);
        })
      }
    );
  }
}
