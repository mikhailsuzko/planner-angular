import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StatDao} from "../interface/StatDao";
import {Stat} from "../../dto/Stat";
import {STAT_URL} from "../../model/consts";
import {HttpMethod, Operation} from "../../model/RequestBFF";
import {environment} from "../../../environments/environment.development";


@Injectable({providedIn: 'root'})
export class StatService implements StatDao {

  constructor(@Inject(STAT_URL) private baseUrl: string, private http: HttpClient) {
  }

  getOverallStat(): Observable<Stat> {
    let httpMethodElement = HttpMethod[HttpMethod.POST];
    const operation = new Operation(httpMethodElement, this.baseUrl, null);
    return this.http.post<Stat>(environment.bffUrl + '/operation', operation);
  }
}
