import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { KeyValidateService } from '../../key/key-validate.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
              private keyValidateService: KeyValidateService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const superAdminLoggedIn = this.keyValidateService.isLogin();
    const isLoggedIn = this.authenticationService.isLogin();
    
    if(superAdminLoggedIn){
      const superAdminUser = this.keyValidateService.currentUserSubject.value;
      
      request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${superAdminUser.token}`
        }
    });
    }
    else if(isLoggedIn){
      const currentUser = this.authenticationService.currentUserValue;
      
      request = request.clone({
          setHeaders: {
              Authorization: `Bearer ${currentUser.token}`
          }
      });
    }

        return next.handle(request);
  }
}
