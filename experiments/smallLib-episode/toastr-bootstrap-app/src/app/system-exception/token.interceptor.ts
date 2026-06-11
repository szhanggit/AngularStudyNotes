import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToasterService } from './toaster.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private readonly toasterSrv : ToasterService) { }    
    
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request)
        .pipe(catchError(e=>{
          if(e.status === 401){
            this.toasterSrv.fnDanger("The User is unauthorized to perform this action");
          }else{
            this.toasterSrv.fnDanger(e.error);
          }
          return throwError(e);
        }));
    }
}