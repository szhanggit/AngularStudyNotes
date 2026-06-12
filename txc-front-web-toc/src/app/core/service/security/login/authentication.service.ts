import { CookieManagerService } from './../coockie-manager/cookie-manager.service';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { LoginRequest } from 'src/app/core/models/security/login-request.model';
import { LoginResponse } from 'src/app/core/models/security/login-response.model';
import { ApiService } from '../../api.service';
import { CookieConstants } from 'src/app/core/models/constants/cookie-constants.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private controller: string = "Authenticate";

  private currentUserSubject: BehaviorSubject<LoginResponse>;

  constructor(private apiSvc: ApiService
            , private readonly toastr:ToastrService
            , private readonly cookiemngr : CookieManagerService) {

    let currentUser: LoginResponse = this.cookiemngr.getCookie(CookieConstants.currentUser);
    this.currentUserSubject = new BehaviorSubject<LoginResponse>(currentUser);
  }

  public get currentUserValue(): LoginResponse {

    return this.currentUserSubject.value;
  }

  login(parameter : LoginRequest)  {
    return  this.apiSvc.post(this.controller, parameter)
    .pipe(
      map(user => {
      this.cookiemngr.setCookie(CookieConstants.currentUser, user);
      this.currentUserSubject.next(user);
      return user;
      }),
      catchError(e => {
        if((e.error)){
            this.toastr.error(e.error);
         }
       return e;
      })
    )
  }

  logout(){
   this.cookiemngr.deleteAllCookie();
  }

  isLogin() : boolean{
    const currentUser = this.cookiemngr.getCookie(CookieConstants.currentUser);
    return this.isTokenExpired(currentUser)
  }

  private isTokenExpired(loginResponse : LoginResponse) : boolean{
    if(loginResponse == null || loginResponse == undefined
        || loginResponse.token == null
      )
    {
      return false;
    }

    const jwtToken = JSON.parse(atob(loginResponse.token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const dateNow = new Date(Date.now());

    if(dateNow > expires)
    {
      this.logout();
      return false;
    }
    return true;
  }
}
