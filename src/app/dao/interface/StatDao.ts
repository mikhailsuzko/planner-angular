import {Observable} from 'rxjs';
import {Stat} from "../../dto/Stat";

export interface StatDao {

  getOverallStat(email: string): Observable<Stat>;

}
