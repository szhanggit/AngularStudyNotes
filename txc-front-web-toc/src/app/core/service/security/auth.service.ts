import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../../models/common/response-model';
import { AuthMeModel } from '../../models/security/auth-me-model';
import { ModResOpModel, UserAuthClaim } from '../../models/security/mod-res-op.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authentication = new BehaviorSubject<AuthMeModel>(new AuthMeModel());
  authorization = new BehaviorSubject<ModResOpModel>(new ModResOpModel());
  userAuthClaim = new ReplaySubject<UserAuthClaim>(1);
  constructor(private readonly httpClient: HttpClient
    , private readonly api:ApiService
    , private readonly router: Router) { }

  fnGetAuth(){
    this.httpClient.get(`${environment.landingUrl}/.auth/me`)
    .pipe(map((res)=>{
      if(res){
        let data = res as AuthMeModel[];
        let result = new AuthMeModel();
        if(data.length > 0)
          result = data[0];
        return result;
      }else{
        return null;
      }
    }))
    .subscribe({
      next: d =>{
        this.authentication.next(d);
        this.fnGetAuthorization();
        this.fnGetUserAuthorizationClaim();
      },error:e =>
      {
        console.error('auth error', e);
        document.location.href = `${environment.landingUrl}/.auth/login/aad?post_login_redirect_uri=/move`;
      }
      , complete: ()=> console.log("completed")
    });
  }

  fnGetAuthorization(){
    this.api.get('auth')
    .pipe(map((d)=>{
      var result = new ModResOpModel();
      if((d) && (d.data)) result = d.data as ModResOpModel;
      //console.log("Menu reference",d);
      return result;
    }))
    .subscribe({
      next:res=> this.authorization.next(res)
      , error: e=> console.error(e)
    });
  }

  fnGetUserAuthorizationClaim(){
    this.api.get('auth')
    .pipe(map((d)=>{
      var result = new UserAuthClaim();
      if((d) && (d.data))
      {
        result = d.data as UserAuthClaim;
        return result;
      }else
      {
        return null;
      }

    }))
    .subscribe({
      next: res =>
      {
        console.log(res);
                
        if((res == null || res == undefined) || ((res.roles) &&(res.roles?.length == 0)))
        {
           this.router.navigate(['403']);
          return;
        }
        this.userAuthClaim.next(res)
      }
      , error: e=>
      {
        console.error(e);
         this.router.navigate(['403']);
      }
    });
  }
}
