import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment.development";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {UtilsService} from "../../dao/impl/UtilsService";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              private utilsService: UtilsService) {
  }

  ngOnInit(): void {
    console.log("LoginComponent -> ngOnInit");
    this.activatedRoute.queryParams.subscribe(params => {

      if (params['code']) {
        const code = params['code'];
        const state = params['state'];
        window.history.pushState({}, "", document.location.href.split("?")[0]);
        this.sendToBFF(code, state);
        return;
      }
      console.log("start pkce from begin")
      this.showAuthWindow();
    });
  }

  private showAuthWindow() {
    console.log("LoginComponent -> showAuthWindow");
    const state = this.randomString(40);
    localStorage.setItem('state', state);

    const params = [
      'response_type=code',
      'client_id=' + environment.kcClientId,
      'state=' + state,
      'scope=openid',
      'redirect_uri=' + encodeURIComponent(environment.loginUrl),
    ];
    let url = environment.kcBaseUrl + '/auth?' + params.join('&');
    window.open(url, '_self')
  }

  private randomString(length: number) {
    let result = "";
    const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const symbolsLength = symbols.length;
    for (let i = 0; i < length; i++) {
      result += symbols.charAt(Math.floor(Math.random() * symbolsLength));
    }
    return result;

  }

  private sendToBFF(code: string, state: string) {
    console.log("LoginComponent -> sendToBFF");
    if (state !== localStorage.getItem('state') as string) {
      console.log('Invalid state');
      return;
    }
    localStorage.removeItem('state');
    console.log(code);
    this.http.post(environment.bffUrl + '/token', code, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).subscribe({
      next: ((response: any) => {
        this.initUserIfNotExist();
      }),
      error: (error => {
        console.log(error);
      })
    });

  }

  private initUserIfNotExist() {
    this.utilsService.initUserIfNotExists().subscribe({
      next: ((response: any) => {
        console.log(response);
        this.router.navigate(['/main']);
      }),
      error: ((error) => {
        console.log(error);
        this.router.navigate(['/main']);
      })
    })
  }
}
