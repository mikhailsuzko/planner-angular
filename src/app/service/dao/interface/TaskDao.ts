import {CommonDao} from './CommonDao';
import {Observable} from 'rxjs';
import {TaskSearchValues} from '../../../model/SearchObjects';
import {Task} from "../../../dto/Task";

export interface TaskDao extends CommonDao<Task> {

  findTasks(taskSearchValues: TaskSearchValues): Observable<Task[]>;

}
