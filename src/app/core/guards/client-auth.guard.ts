import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { appVariables, page } from 'src/app/constants/api.constants';
import { api_url } from 'src/app/constants/api.resources.constants';

@Injectable({
  providedIn: 'root'
})
export class ClientAuthGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentUser = JSON.parse(localStorage.getItem(appVariables.USER_LOCAL_STORAGE));

    if (currentUser == null) {
      this.router.navigate([page.LOGIN_PAGE]);
    }

    if (currentUser.isAdmin) {

    }
    return true;
  }

}
