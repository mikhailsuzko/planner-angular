import {Injectable} from "@angular/core";
import {TokenUtils} from "./TokenUtils";

@Injectable({providedIn: 'root'})
export class CommonUtils {

  constructor(private tokenUtils: TokenUtils) {
  }

  public processError(method: string, error: any, callback: Function) {
    console.log(method + " -> error: " + error.error);
    console.log(method + " -> status: " + error.status);
    if (error && error.status === 403) {
      this.tokenUtils.exchangeRefreshToken(callback);
    }
  }
}
