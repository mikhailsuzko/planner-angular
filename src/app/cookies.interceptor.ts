import {HttpInterceptorFn} from '@angular/common/http';

export const cookiesInterceptor: HttpInterceptorFn = (request, next) => {
  request = request.clone({
    withCredentials: true,
  });
  return next(request);
};
