import {HttpEvent, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {SpinnerService} from "./service/spinner.service";
import {tap} from "rxjs/operators";
import {inject} from "@angular/core";

export const cookiesInterceptor: HttpInterceptorFn = (request, next) => {
  request = request.clone({
    withCredentials: true,
  });
  return next(request);
};

export const spinnerInterceptor: HttpInterceptorFn = (request, next) => {
  const spinnerService = inject(SpinnerService);
  spinnerService.show();
  return next(request)
    .pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          spinnerService.hide();
        }
      }, (error) => {
        console.log(error);
        spinnerService.hide();
      })
    );
};
