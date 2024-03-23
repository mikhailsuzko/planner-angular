import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from './CommonService';
import {PriorityDao} from '../interface/PriorityDao';
import {CategorySearchValues} from '../../model/search/SearchObjects';
import {Observable} from 'rxjs';
import {Priority} from "../../dto/Priority";
import {PRIORITY_URL} from "../../model/consts";
import {HttpMethod, Operation} from "../../model/RequestBFF";
import {environment} from "../../../environments/environment.development";


@Injectable({providedIn: 'root'})
export class PriorityService extends CommonService<Priority> implements PriorityDao {
  constructor(@Inject(PRIORITY_URL) private baseUrl: string,
              private http: HttpClient) {
    super(baseUrl, http);
  }

  findPriorities(categorySearchValues: CategorySearchValues): Observable<Priority[]> {
    let httpMethodElement = HttpMethod[HttpMethod.POST];
    const backendUrl = this.baseUrl + '/search';
    const operation = new Operation(httpMethodElement, backendUrl, categorySearchValues);
    return this.http.post<Priority[]>(environment.bffUrl + '/operation', operation);
  }
}
