import {Component, OnInit} from '@angular/core';
import CryptoES from 'crypto-es';
import {environment} from "../../environments/environment.development";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";

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
              private router: Router) {
  }

  ngOnInit(): void {
    console.log("LoginComponent -> ngOnInit");
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['code']) {
        const code = params['code'];
        const state = params['state'];
        localStorage.setItem('CODE', code);
        window.history.pushState({}, "", document.location.href.split("?")[0]);
        console.log("code: " + code);
        console.log("state: " + state);
        this.getTokens(code, state)
        return;
      }
    })
    const accessToken = localStorage.getItem('CODE')
    if (!accessToken) {
      this.startPKCE();
    }
    localStorage.removeItem('CODE')
  }

  private startPKCE() {
    console.log("LoginComponent -> startPKCE");
    const state = this.randomString(40);
    const codeVerifier = this.randomString(128);

    localStorage.setItem('state', state);
    localStorage.setItem('codeVerifier', codeVerifier);

    const codeChallenge = CryptoES.SHA256(codeVerifier).toString(CryptoES.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    console.log("codeChallenge: " + codeChallenge);

    const params = [
      'response_type=code',
      'client_id=' + environment.kcClientId,
      'state=' + state,
      'scope=openid',
      'code_challenge=' + codeChallenge,
      'code_challenge_method=S256',
      'redirect_uri=' + encodeURIComponent(environment.loginUrl)
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

  private getTokens(code: string, state: string) {
    console.log("LoginComponent -> getTokens");
    if (state !== localStorage.getItem('state') as string) {
      console.log("Invalid state");
      return;
    }
    localStorage.removeItem('state');
    const codeVerifier = localStorage.getItem('codeVerifier') as string;
    localStorage.removeItem('codeVerifier');
    const body = new HttpParams()
      .append('grant_type', 'authorization_code')
      .append('code', code)
      .append('code_verifier', codeVerifier)
      .append('redirect_uri', environment.loginUrl)
      .append('client_id', environment.kcClientId);
    this.http.post(environment.kcBaseUrl + '/token', body, {
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    }).subscribe({
      next: ((response: any) => {
        localStorage.setItem("IT", response.id_token);
        localStorage.setItem("RT", response.refresh_token);
        localStorage.removeItem("CODE");

        this.router.navigate(['/data'], {queryParams: {token: response.access_token}});
      }),
      error: ((error: any) => {
        console.log(error);
        localStorage.removeItem("CODE");
      })
    })
  }
}
