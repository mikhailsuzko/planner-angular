import {Injectable} from "@angular/core";
import {TokenUtils} from "./TokenUtils";

@Injectable({providedIn: 'root'})
export class CommonUtils {

  constructor(private tokenUtils: TokenUtils) {
  }

  public processError(method: string, error: any, callback: Function) {
    console.log(method + " -> error: " + error.status + ": " + error.message);
    if (error && error.status === 403) {
      this.tokenUtils.exchangeRefreshToken(callback);
    }
  }
}
