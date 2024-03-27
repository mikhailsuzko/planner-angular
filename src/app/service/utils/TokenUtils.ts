import {environment} from "../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class TokenUtils{
  constructor(private http: HttpClient,
              private router: Router) {
  }

  public exchangeRefreshToken(callback: Function): void {
    console.log("TokenUtils -> exchangeRefreshToken");
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

  public redirectToLogin() {
    console.log("MainComponent -> redirectToLogin");
    this.router.navigate(['/login']);
  }
}
