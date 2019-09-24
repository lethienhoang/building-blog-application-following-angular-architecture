import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './authentication/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { ApiPrefixInterceptor } from './interceptors/api-prefix.interceptor';
import { RouterModule } from '@angular/router';
import { HttpsService } from './http/https.service';
import { BaseService } from './http/base.service';
import { HelperService } from './services/helper.service';
import { LoaderService } from './services/loader.service';
import { CustomErrorHandlerService } from './services/custom-error-handler.service';
import { LoggerService } from './logger.service';
import { EnsureModuleLoadedOnceGuard } from './EnsureModuleLoadedOnceGuard';
import { JwtHelperService } from '@auth0/angular-jwt';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,

  ],
  exports: [
    RouterModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    HttpsService,
    BaseService,
    HelperService,
    LoaderService,
    CustomErrorHandlerService,
    LoggerService,
    JwtHelperService
    ,
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
// Ensure that CoreModule is only loaded into AppModule
export class CoreModule extends EnsureModuleLoadedOnceGuard {

  /**
   *
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);

  }
}
