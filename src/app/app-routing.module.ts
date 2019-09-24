import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './modules/pages/home/home.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';



const routes: Routes = [
  {
    path: '',
    loadChildren: './modules/pages/pages.module#PagesModule',
    pathMatch: 'prefix'
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: './modules/auth/auth.module#AuthModule',
    pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
