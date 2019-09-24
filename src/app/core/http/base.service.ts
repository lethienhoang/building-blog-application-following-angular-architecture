import { Injectable, Injector } from '@angular/core';
import { Headers, Http, Request, RequestOptions, Response, XHRBackend } from '@angular/http';
import { Router } from '@angular/router';
import { AppModule } from '../../app.module';
import { appVariables } from '../../constants/api.constants';



import { catchError } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { HttpsService } from './https.service';
import { api_url } from 'src/app/constants/api.resources.constants';
import { CustomErrorHandlerService } from '../services/custom-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService extends Http {

  // router: Router;
  constructor(backend: XHRBackend, options: RequestOptions, public errorHandler: CustomErrorHandlerService, private router: Router) {
    super(backend, options);
    // this.router = AppModule.injector.get(Router);

   }

   request(url: string | Request, options?: RequestOptions) : Observable<Response> {
     if (typeof url === 'string') {
       if (!options) {
          options = new RequestOptions({headers: new Headers()});
       }

       this.createRequestOptions(options);
     } else {
      this.createRequestOptions(url);
    }
     return super.request(url, options).pipe(catchError((err, caught) => {
      this.errorHandler.handleError(err);
      return Observable.throw(err);
    }));
   }

   createRequestOptions(options: RequestOptions | Request) {

     const contentTypeHeader: string = options.headers.get('Content-Type');

     if (!contentTypeHeader) {
      options.headers.append('Content-Type', appVariables.DEFAULT_CONTENT_TYPE_HEADER);
     }
   }

  //  catchAuthError(self: BaseService) {
  //   return (res: Response) => {
  //     if (res.status === 401 || res.status === 403) {
  //       // if not authenticated
  //       localStorage.removeItem(appVariables.userLocalStorage);
  //       localStorage.removeItem(appVariables.accessTokenLocalStorage);
  //       this.router.navigate([api_url.loginPageUrl]);
  //     }

  //     return Observable.throw(res);
  //   }



}
