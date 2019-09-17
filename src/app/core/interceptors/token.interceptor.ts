import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomErrorHandlerService } from '../services/custom-error-handler.service';
import { tap, switchMap, finalize, catchError, take, filter } from 'rxjs/operators';
import { appVariables } from 'src/app/constants/api.constants';
import { AuthService } from '../authentication/auth.service';
import { Token } from '../models/token.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private errorHandler;
    private authService;
    constructor(private injector: Injector) {
        this.errorHandler = this.injector.get(CustomErrorHandlerService);
        this.authService = this.injector.get(AuthService);
    }
    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem(appVariables.ACCESS_TOKEN_LOCAL_STORAGE);

        const headersConfig = {
        };
        if (token) {
            headersConfig['Authorization'] = `Bearer ${token}`;
        }

        const req = this.addTokenToRequest(request, token);
        return next.handle(req).pipe(
            tap(
                event => {
                    //logging the http response to browser's console in case of a success
                    if (event instanceof HttpResponse) {
                        console.log("api call success :", event);
                    }
                },
                error => {
                    //logging the http response to browser's console in case of a failuer
                    console.log("api call error :", event);

                    if (error instanceof HttpErrorResponse) {
                        switch ((<HttpErrorResponse>error).status) {
                            case 401:
                                return this.handle401Error(request, next);
                            case 400:
                                return <any>this.authService.logout();
                        }
                    } else {
                        this.errorHandler.handleError(error);
                    }

                }
            ));
    }

    private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);

            return this.authService.refreshToken()
                .pipe(
                    switchMap((token: Token) => {
                        if (token) {
                            this.tokenSubject.next(token.token);;
                            return next.handle(this.addTokenToRequest(request, token.token));
                        }

                        return <any>this.authService.logout();
                    }),
                    catchError(err => {
                        return <any>this.authService.logout();
                    }),
                    finalize(() => {
                        this.isRefreshingToken = false;
                    })
                );
        } else {
            this.isRefreshingToken = false;

            return this.tokenSubject
                .pipe(filter(token => token !== null),
                    take(1),
                    switchMap((token: any) => {
                        return next.handle(this.addTokenToRequest(request, token));
                    }));
        }

    }

}