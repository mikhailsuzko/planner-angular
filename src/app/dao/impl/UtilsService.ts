import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UTILS_URL} from "../../model/consts";
import {HttpMethod, Operation} from "../../model/RequestBFF";
import {environment} from "../../../environments/environment.development";


@Injectable({providedIn: 'root'})
export class UtilsService {

  constructor(@Inject(UTILS_URL) private baseUrl: string, private http: HttpClient) {
  }

  initUserIfNotExists(): Observable<boolean> {
    let httpMethodElement = HttpMethod[HttpMethod.GET];
    const operation = new Operation(httpMethodElement, this.baseUrl + '/init', null);
    return this.http.post<boolean>(environment.bffUrl + '/operation', operation);
  }
}
