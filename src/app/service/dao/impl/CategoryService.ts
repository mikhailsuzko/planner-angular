import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from './CommonService';
import {CategoryDao} from '../interface/CategoryDao';
import {CategorySearchValues} from '../../../model/SearchObjects';
import {Observable} from 'rxjs';
import {Category} from "../../../dto/Category";
import {CATEGORY_URL} from "../../../model/consts";
import {HttpMethod, Operation} from "../../../model/RequestBFF";
import {environment} from "../../../../environments/environment.development";


@Injectable({providedIn: 'root'})
export class CategoryService extends CommonService<Category> implements CategoryDao {

  constructor(@Inject(CATEGORY_URL) private baseUrl: string, private http: HttpClient) {
    super(baseUrl, http);
  }

  findCategories(searchValues: CategorySearchValues): Observable<Category[]> {
    let httpMethodElement = HttpMethod[HttpMethod.POST];
    const backendUrl = this.baseUrl + '/search';
    const operation = new Operation(httpMethodElement, backendUrl, searchValues);
    return this.http.post<Category[]>(environment.bffUrl + '/operation', operation);
  }
}
