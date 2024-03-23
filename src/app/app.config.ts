import {ApplicationConfig, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {HttpClient, provideHttpClient, withInterceptors} from "@angular/common/http";
import {cookiesInterceptor} from "./cookies.interceptor";
import {environment} from "../environments/environment.development";
import {CATEGORY_URL, PRIORITY_URL, STAT_URL, TASK_URL, UTILS_URL} from "./model/consts";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideNativeDateAdapter} from "@angular/material/core";
import {registerLocaleData} from "@angular/common";
import localeRu from '@angular/common/locales/ru';
import {MatPaginatorIntl} from "@angular/material/paginator";
import {TasksMatPaginatorIntl} from "./intl/TasksMatPaginatorIntl";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptors([cookiesInterceptor])),
    provideNativeDateAdapter(),
    {provide: UTILS_URL, useValue: environment.backendUrl + '/data'},
    {provide: TASK_URL, useValue: environment.backendUrl + '/task'},
    {provide: CATEGORY_URL, useValue: environment.backendUrl + '/category'},
    {provide: PRIORITY_URL, useValue: environment.backendUrl + '/priority'},
    {provide: STAT_URL, useValue: environment.backendUrl + '/stat'},
    {provide: LOCALE_ID, useValue: 'ru-RU'},
    {provide: MatPaginatorIntl, useClass: TasksMatPaginatorIntl},
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })),


  ]
};
