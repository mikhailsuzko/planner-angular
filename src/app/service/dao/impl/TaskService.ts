import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {CommonService} from './CommonService';
import {TaskSearchValues} from '../../../model/SearchObjects';
import {Task} from '../../../dto/Task';
import {TaskDao} from "../interface/TaskDao";
import {TASK_URL} from "../../../model/consts";
import {HttpMethod, Operation} from "../../../model/RequestBFF";
import {environment} from "../../../../environments/environment.development";


@Injectable({providedIn: 'root'})
export class TaskService extends CommonService<Task> implements TaskDao {

  constructor(@Inject(TASK_URL) private baseUrl: string, private http: HttpClient) {
    super(baseUrl, http);
  }

  findTasks(searchValues: TaskSearchValues): Observable<any> {
    let httpMethodElement = HttpMethod[HttpMethod.POST];
    const backendUrl = this.baseUrl + '/search';
    const operation = new Operation(httpMethodElement, backendUrl, searchValues);
    return this.http.post<any>(environment.bffUrl + '/operation', operation);
  }
}
