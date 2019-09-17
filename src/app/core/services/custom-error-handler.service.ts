import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http'
import { AppModule } from 'src/app/app.module';
import { LoggerService } from '../logger.service';
import { Router } from '@angular/router';
import { appVariables, page } from 'src/app/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandlerService implements ErrorHandler {

  router: Router;
  constructor() {
    this.router = AppModule.injector.get(Router);

   }
  // Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
  handleError(error: Error | HttpErrorResponse) {
    // Do something with the error
    const loggingService = AppModule.injector.get(LoggerService);
    const router = AppModule.injector.get(Router);
    // log on the server
    // loggingService.log({ message });

    if (!navigator.onLine) {
      // Handle offline error
      // return notificationService.notify('No Internet Connection');
      router.navigate([page.ERROR_PAGE], { queryParams: { message: 'No Internet Connection' } });
    }
    
    if (error instanceof HttpErrorResponse) {
      
      // if (error.status === 401 || error.status === 403) {
      //   localStorage.removeItem(appVariables.USER_LOCAL_STORAGE);
      //   localStorage.removeItem(appVariables.ACCESS_TOKEN_LOCAL_STORAGE);
      //   localStorage.removeItem(appVariables.ACCESS_REFRESH_TOKEN_LOCAL_STORAGE);
      //   this.router.navigate([page.LOGIN_PAGE]);
      // }       
      router.navigate([page.ERROR_PAGE], { queryParams: { error: error } });

    } 
    throw error;
    
  }
}
