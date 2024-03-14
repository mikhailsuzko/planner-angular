import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CommonDao} from '../interface/CommonDao';
import {HttpMethod, Operation} from "../../model/RequestBFF";
import {environment} from "../../../environments/environment.development";

export class CommonService<T> implements CommonDao<T> {
  private readonly backendUrl: string;

  constructor(backendUrl: string, private httpClient: HttpClient) {
    this.backendUrl = backendUrl;
  }

  add(t: T): Observable<T> {
    let httpMethodElement = HttpMethod[HttpMethod.PUT];
    const backendUrl = this.backendUrl + '/add';
    const operation = new Operation(httpMethodElement, backendUrl, t);
    return this.sendOperation(operation);
  }

  delete(id: number): Observable<any> {
    let httpMethodElement = HttpMethod[HttpMethod.DELETE];
    const backendUrl = this.backendUrl + '/delete/' + id;
    const operation = new Operation(httpMethodElement, backendUrl, null);
    return this.sendOperation(operation);
  }

  findById(id: number): Observable<T> {
    let httpMethodElement = HttpMethod[HttpMethod.POST];
    const backendUrl = this.backendUrl + '/id';
    const operation = new Operation(httpMethodElement, backendUrl, id);
    return this.sendOperation(operation);
  }

  findAll(): Observable<T[]> {
    let httpMethodElement = HttpMethod[HttpMethod.GET];
    const backendUrl = this.backendUrl + '/all';
    const operation = new Operation(httpMethodElement, backendUrl, null);
    return this.sendOperation(operation);
  }

  update(t: T): Observable<any> {
    let httpMethodElement = HttpMethod[HttpMethod.PATCH];
    const backendUrl = this.backendUrl + '/update';
    const operation = new Operation(httpMethodElement, backendUrl, t);
    return this.sendOperation(operation);
  }

  private sendOperation(operation: Operation) {
    return this.httpClient.post<any>(environment.bffUrl + '/operation', operation);
  }
}
