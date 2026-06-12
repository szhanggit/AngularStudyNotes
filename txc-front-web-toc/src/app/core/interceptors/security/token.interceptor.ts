import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../../service/security/auth.service';
import { AuthMeModel } from '../../models/security/auth-me-model';
import { AuthorityMetadataEntity } from '@azure/msal-common';
import { ToasterService } from '../../service/tools/toaster.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private readonly authSvc:AuthService,
    private readonly toasterSrv : ToasterService) {

  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let authModel = new AuthMeModel;
    this.authSvc.authentication
    .subscribe(d=>{
      if (d.access_token != ""){
        authModel = d;
        //console.log("authModel", authModel,request.url);
      }
    });

    const superAdminToken = localStorage.getItem("sak");
    const isSuperAdmin = request.url.toString().includes("amm/SuperAdmin");
    if(isSuperAdmin){
      const modifiedReq = request.clone({
        headers: request.headers.set('Authorization',`Bearer ${superAdminToken}`)
      });
      return next.handle(modifiedReq);
    }else{
      const modifiedReq = request.clone({
        headers: request.headers
          .set('X-MS-TOKEN-AAD-ACCESS-TOKEN', authModel.access_token)
        });
      //console.log("modifiedReq",modifiedReq);
      return next.handle(modifiedReq)
      .pipe(catchError(e=>{
        if(e.status === 401){
          this.toasterSrv.fnDanger("The User is unauthorized to perform this action");
        }else{
          this.toasterSrv.fnDanger(e.error.message);
        }
        return throwError(e);
      }));
    }
  }
}
