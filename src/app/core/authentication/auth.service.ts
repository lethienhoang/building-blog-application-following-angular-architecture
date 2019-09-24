import { Injectable } from '@angular/core';
import { HttpsService } from '../http/https.service';
import { CustomErrorHandlerService } from '../services/custom-error-handler.service';
import { UserIdentify } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { api_url } from 'src/app/constants/api.resources.constants';
import { mapTo, catchError, tap } from 'rxjs/operators';
import { appVariables } from 'src/app/constants/api.constants';
import { Token } from '../models/token.model';
import { HelperService } from '../services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpsService, private helper: HelperService, private errorHandler: CustomErrorHandlerService)
  { }

  login(user: UserIdentify): Observable<boolean> {
    return this.http.post(api_url.LOGIN_URL, user)
    .pipe(
      tap(
        (tokens: any) => this.storeTokens(tokens)
      ),
      mapTo(true),
      catchError(error => {
        this.errorHandler.handleError(error);
        return of(false);
      }));

  }

  logout() {
    return this.http.post(api_url.LOGOUT_URL)
    .pipe(
      tap(() => this.removeTokens()
      ),
      mapTo(true),
      catchError(error => {
        this.errorHandler.handleError(error);
        return of(false);
      })
    )
  }

  refreshToken() {
    const body = {
      refreshToken: localStorage.getItem(appVariables.ACCESS_REFRESH_TOKEN_LOCAL_STORAGE),
      token: localStorage.getItem(appVariables.ACCESS_TOKEN_LOCAL_STORAGE)
    }
    return this.http.post(api_url.REFRESH_TOKEN_URL, body)
    .pipe(
      tap((tokens: any) => this.storeTokens(tokens)),
    )
  }

  isLogin(): boolean {
    const currentUser = localStorage.getItem(appVariables.USER_LOCAL_STORAGE);

    if (currentUser) {
      return true;
    }

    return false;
  }

  private storeTokens(token: Token) {
    localStorage.setItem(appVariables.USER_LOCAL_STORAGE, JSON.stringify(this.helper.jwt_decode_token(token.token)));
    localStorage.setItem(appVariables.ACCESS_TOKEN_LOCAL_STORAGE, token.token);
    localStorage.setItem(appVariables.ACCESS_REFRESH_TOKEN_LOCAL_STORAGE, token.refreshToken);
  }

  private removeTokens() {
    localStorage.removeItem(appVariables.USER_LOCAL_STORAGE);
    localStorage.removeItem(appVariables.ACCESS_TOKEN_LOCAL_STORAGE);
    localStorage.removeItem(appVariables.ACCESS_REFRESH_TOKEN_LOCAL_STORAGE);
  }
}
