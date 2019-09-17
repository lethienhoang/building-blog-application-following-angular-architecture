import { environment } from '../../environments/environment';
import { HttpRequest } from '@angular/common/http';


export const apiBaseUrl = function url(request: HttpRequest<any>): string {
    return `${environment.apiHost}${request.url}`;
}

export const appVariables = { 
    USER_LOCAL_STORAGE: 'user',
    ACCESS_TOKEN_SERVER: 'Authorization',
    ACCESS_TOKEN_LOCAL_STORAGE: 'token',
    ACCESS_REFRESH_TOKEN_LOCAL_STORAGE: 'refreshToken',
    DEFAULT_CONTENT_TYPE_HEADER: 'application/json'
}

export const page = {
    LOGIN_PAGE: 'Login',
    ERROR_PAGE: 'Error'
}

