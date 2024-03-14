import {CommonDao} from "./CommonDao";
import {Category} from "../../dto/Category";
import {CategorySearchValues} from "../search/SearchObjects";
import {Observable} from "rxjs";

export interface CategoryDao extends CommonDao<Category> {
  findCategories(searchValue: CategorySearchValues): Observable<Category[]>
}
