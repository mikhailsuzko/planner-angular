import {Observable} from "rxjs";

export interface CommonDao<T> {
  findAll(): Observable<T[]>;

  findById(id: number): Observable<T>;

  update(obj: T): Observable<T>;

  delete(id: number): Observable<T>;

  add(obj: T): Observable<T>;
}
