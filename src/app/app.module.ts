import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, NgModuleRef, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavComponent } from './layout/nav/nav.component';
import { AuthModule } from './modules/auth/auth.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { CustomErrorHandlerService } from './core/services/custom-error-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    ContentLayoutComponent,
    FooterComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [
    {
      provide: ErrorHandler, 
      useClass: CustomErrorHandlerService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

  // Allows for retrieving singletons using `AppModule.injector.get(service)`
  /**
   *
   */
  static injector: Injector
  constructor(private injector: Injector) {
    //we use a simple singleton class called AppInjector 
    AppModule.injector = injector;
  }
}
