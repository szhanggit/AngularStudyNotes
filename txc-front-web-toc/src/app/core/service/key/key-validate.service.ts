import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseModel } from 'src/app/core/models/common/response-model';
import { KeyValidateRequest } from 'src/app/core/models/key/key-validate-request.model';
import { KeyValidateResponse } from 'src/app/core/models/key/key-validate-response.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class KeyValidateService {

  private controller: string = "amm";
  private cookieName: string = "superadminUser";

  public currentUserSubject: BehaviorSubject<KeyValidateResponse>;

  // constructor(private apiSvc: ApiService, private cookieService : CookieService, private readonly toastr:ToastrService) {
  //   let currentUser: KeyValidateResponse = this.cookieService.get(this.cookieName) === ""  ? null : JSON.parse(this.cookieService.get(this.cookieName));
  //   this.currentUserSubject = new BehaviorSubject<KeyValidateResponse>(currentUser);
  // }
  constructor(private apiSvc: ApiService) {
  }

  // validateKey(parameter : KeyValidateRequest)  {
  //   return  this.apiSvc.post(this.controller + "/KeyValidate", parameter)
  //   .pipe(
  //     map(response => {
  //       console.log('response-service-level',response);
  //       let data = response.data as KeyValidateResponse;
  //       data.message = response.message;
  //       if(data.token){

  //         // this.cookieService.set(this.cookieName, JSON.stringify(data.token) ,{path : "/"});
  //         this.currentUserSubject.next(data);
  //       }
  //       return data;
  //     }),
  //     catchError(e => {
  //       if((e.error)){
  //           console.log(e.error.message);
  //        }
  //      return e;
  //     })
  //   )
  // }
  validateKey(parameter : KeyValidateRequest) : Observable<ResponseModel>  {
    return  this.apiSvc.post(this.controller + "/KeyValidate", parameter);
  }

  isLogin() : boolean
  {
    return this.isTokenExpired(this.currentUserSubject.value)
  }

  logout(){
    // this.cookieService.deleteAll();
    this.currentUserSubject.next(null);
  }

  private isTokenExpired(validateResponse : KeyValidateResponse) : boolean
  {
    if(validateResponse == null || validateResponse == undefined
        || validateResponse.token == null
      )
    {
      return false;
    }

    const jwtToken = JSON.parse(atob(validateResponse.token.split('.')[1]));
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
