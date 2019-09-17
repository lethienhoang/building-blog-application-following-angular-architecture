import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { apiBaseUrl } from 'src/app/constants/api.constants';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        console.log('url: ' + apiBaseUrl(request));
        request = request.clone({url: apiBaseUrl(request)});
        return next.handle(request);
    }
}