import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {jwtDecode} from "jwt-decode";

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent implements OnInit {
  private accessToken: any = "";
  private refreshToken: any = "";
  private jwt: any = ""
  private idToken: any = ""
  data = "";

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log("DataComponent -> ngOnInit");
    this.activatedRoute.queryParams.subscribe(params => {
      this.accessToken = params['token'];
      this.fillJwtAndIdToken();
      if (this.accessToken) {
        console.log("DataComponent -> ngOnInit -> Using access token");
        window.history.pushState({}, "", document.location.href.split("?")[0]);
        this.getUserData(this.accessToken);
        return;
      }
      this.refreshToken = localStorage.getItem('RT') as string;
      if (this.refreshToken) {
        console.log("DataComponent -> ngOnInit -> Using refresh token");
        this.exchangeRefreshToken(this.refreshToken);
        return;
      }
      this.redirectToLogin();
    })
  }

  private fillJwtAndIdToken() {
    this.idToken = localStorage.getItem('IT') as string;
    if (this.idToken) {
      this.jwt = jwtDecode(this.idToken);
    }
  }

  get email() {
    return this.jwt.email;
  }

  private getUserData(token: string) {
    console.log("DataComponent -> getUserData");
    const data = {email: this.email};
    const body = JSON.stringify(data);

    this.http.post<any>(environment.backendUrl + "/user/data", body, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      {
        next: ((response: any) => {
          this.data = response.data;
        }),
        error: (error => {
          console.log(error);
          this.tryExchangeRefreshToken();
        })
      });
  }

  private exchangeRefreshToken(token: string) {
    console.log("DataComponent -> exchangeRefreshToken");
    const body = new HttpParams()
      .append('grant_type', 'refresh_token')
      .append('client_id', environment.kcClientId)
      .append('refresh_token', token);

    this.http.post(environment.kcBaseUrl + '/token', body).subscribe({
      next: ((response: any) => {
        localStorage.setItem('RT', response.refresh_token);
        localStorage.setItem('IT', response.id_token);
        this.getUserData(response.access_token);
      }),
      error: (error => {
        console.log(error);
        this.redirectToLogin()
      })
    })
  }

  private redirectToLogin() {
    localStorage.removeItem('IT');
    localStorage.removeItem('RT');
    this.router.navigate(['/login']);
  }

  private tryExchangeRefreshToken() {
    const token = localStorage.getItem('RT');
    if (token) {
      this.exchangeRefreshToken(token);
    } else {
      this.redirectToLogin();
    }
  }

  logout() {
    const params = [
      'post_logout_redirect_uri=' + environment.loginUrl,
      'id_token_hint=' + this.idToken,
      'client_id=' + environment.kcClientId];
    const logoutUrl = environment.kcBaseUrl + '/logout?' + params.join('&');
    window.open(logoutUrl, '_self');
    this.accessToken = "";
    this.idToken = "";
    this.refreshToken = "";
    this.jwt = ""
    localStorage.removeItem('RT');
    localStorage.removeItem('IT');
  }
}
