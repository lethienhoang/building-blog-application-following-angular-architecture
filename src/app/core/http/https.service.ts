import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestOptions, Response, XHRBackend } from '@angular/http';
import { Router } from '@angular/router';



import { CustomErrorHandlerService } from '../services/custom-error-handler.service';
import { HelperService } from '../services/helper.service';
import { LoaderService } from '../services/loader.service';
import { appVariables } from 'src/app/constants/api.constants';
import { ServerResponse } from 'src/app/interfaces/server-response';
import { ErrorResponse } from 'src/app/interfaces/error';
import { BaseService } from './base.service';

import { Observable } from 'rxjs'
import { catchError, map, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpsService {

  constructor(public http: BaseService, public errorHandler: CustomErrorHandlerService,
              public helperService: HelperService,
              private loaderService: LoaderService) {

  }

  get(url) {
    this.loaderService.show();

    return this.http.get(url).pipe(map((res: Response) => this.handleResponse(res)),
      catchError((err, caught) => {
        this.errorHandler.handleError(err);
        return Observable.throw(err);
      }),
      finalize(() => {
        this.loaderService.hide();
      }));
  }

  post(url, body?: any, options?: RequestOptions) {
    this.loaderService.show();
    if (options) {
      return this.http.post(url, body, options)
        .pipe(map((res: Response) => this.handleResponse(res)),
          catchError((err, caught) => {
            this.errorHandler.handleError(err);
            return Observable.throw(err);
          }),
          finalize(() => {
            this.loaderService.hide();
          }));
    } else {
      return this.http.post(url, body)
        .pipe(map((res: Response) => this.handleResponse(res)),
          catchError((err, caught) => {
            this.errorHandler.handleError(err);
            return Observable.throw(err);
          }),
          finalize(() => {
            this.loaderService.hide();
          }));
    }
  }

  delete(url, body: any) {
    this.loaderService.show();
    return this.http.delete(url).pipe(map((res: Response) => this.handleResponse(res)),
      catchError((err, caught) => {
        this.errorHandler.handleError(err);
        return Observable.throw(err);
      }),
      finalize(() => {
        this.loaderService.hide();
      }));
  }

  put(url, body) {
    this.loaderService.show();
    return this.http.put(url, body).pipe(map((res: Response) => this.handleResponse(res)),
      catchError((err, caught) => {
        this.errorHandler.handleError(err)
        return Observable.throw(err);
      }),
      finalize(() => {
        this.loaderService.hide();
      }));
  }

  upload(url: string, file: File) {
    const formData: FormData = new FormData();
    if (file) {
      formData.append('files', file, file.name);
    }
    return this.post(url, formData);
  }

  formUrlParam(url, data) {
    let queryString = '';
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (!queryString) {
          queryString = `?${key}=${data[key]}}`;
        } else {
          queryString += `&${key}=${data[key]}}`;
        }
      }
    }

    return url + queryString;
  }

  handleResponse(res: Response): Response {

    return  res.json();
  }

  // refreshToken(res: Response) {
  //   const token = res.headers.get(appVariables.accessTokenServer);
  //   // const refreshToken = res.
  //   if (token) {
  //     localStorage.setItem(appVariables.accessTokenLocalStorage, `${token}`);
  //   }
  // }
}
