import {CommonDao} from './CommonDao';
import {Observable} from 'rxjs';
import {TaskSearchValues} from '../../model/search/SearchObjects';
import {Task} from "../../dto/Task";

export interface TaskDao extends CommonDao<Task> {

  findTasks(taskSearchValues: TaskSearchValues): Observable<Task[]>;

}
