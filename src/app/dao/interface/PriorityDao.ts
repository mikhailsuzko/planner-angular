import {PrioritySearchValues} from '../search/SearchObjects';
import {Observable} from 'rxjs';
import {Priority} from "../../dto/Priority";
import {CommonDao} from "./CommonDao";


export interface PriorityDao extends CommonDao<Priority> {

  findPriorities(prioritySearchValues: PrioritySearchValues): Observable<Priority[]>;

}
