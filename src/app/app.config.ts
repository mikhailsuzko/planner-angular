import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {cookiesInterceptor} from "./cookies.interceptor";
import {environment} from "../environments/environment.development";
import {CATEGORY_URL, PRIORITY_URL, STAT_URL, TASK_URL, UTILS_URL} from "./model/consts";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([cookiesInterceptor])),

    {provide: UTILS_URL, useValue: environment.backendUrl + '/data'},
    {provide: TASK_URL, useValue: environment.backendUrl + '/task'},
    {provide: CATEGORY_URL, useValue: environment.backendUrl + '/category'},
    {provide: PRIORITY_URL, useValue: environment.backendUrl + '/priority'},
    {provide: STAT_URL, useValue: environment.backendUrl + '/stat'},

  ]
};
