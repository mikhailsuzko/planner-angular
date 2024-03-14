import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {UserProfile} from "../dto/DtoObjects";
import {NgIf} from "@angular/common";
import {PriorityService} from "../dao/impl/PriorityService";
import {Priority} from "../dto/Priority";

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  userProfile!: UserProfile;
  priorities!: Priority[];

  constructor(private http: HttpClient,
              private router: Router,
              private priorityService: PriorityService) {
  }

  ngOnInit(): void {
    console.log("MainComponent -> ngOnInit");
    window.history.pushState({}, "", document.location.href.split("?")[0]);
    this.requestUserData();
  }

  private requestUserData(): void {
    console.log("MainComponent -> requestUserData");
    this.requestPriorities();
    this.requestUserProfile();
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
        })
      }
    );
  }

  private requestPriorities() {
    this.priorityService.findAll().subscribe({
      next: ((response) => {
        this.priorities = response;
        console.log("requestPriorities -> response: " + response);
      }),
      error: (error) => {
        console.log("requestPriorities -> error: " + error);
        this.exchangeRefreshToken();
      }
    })
  }

}
