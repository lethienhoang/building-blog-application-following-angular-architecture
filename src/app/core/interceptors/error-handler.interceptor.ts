import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomErrorHandlerService } from '../services/custom-error-handler.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
    /**
     *
     */
    constructor(private errorHandler: CustomErrorHandlerService) {
        
    }

    intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err, caught) => {
            this.errorHandler.handleError(err)
            return Observable.throw(err);
          }));          
    }
}