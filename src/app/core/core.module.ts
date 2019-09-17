import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './authentication/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { ApiPrefixInterceptor } from './interceptors/api-prefix.interceptor';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
   AuthService,
   {
     provide: HTTP_INTERCEPTORS,
     useClass: TokenInterceptor,
     multi: true
   },
   {
     provide: HTTP_INTERCEPTORS,
     useClass: ErrorHandlerInterceptor,
     multi: true
   },
   {
     provide: HTTP_INTERCEPTORS,
     useClass: ApiPrefixInterceptor,
     multi: true
   }
  ]
})
export class CoreModule { }
