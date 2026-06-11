import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { finalize, Observable, tap, catchError, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loader: LoaderService
    , private authenticationService: AuthenticationService
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {



    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpheWRlZXAgUGF0aWwiLCJpYXQiOjE1MTYyMzkwMjJ9.yt3EOXf60R62Mef2oFpbFh2ihkP5qZ4fM8bjVnF8YhA";//his.authService.getToken();
    this.loader.show();
    console.log(req);
    const GUID = 'f4179b26-21ac-432c-bcd8-cb4bc6e50981';
    const isSuperAdmin = req.url.toString().includes("amm/SuperAdmin");

    if (authToken) {  //  Authentication Interceptor
      // Clone the request and attach the token
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

      return next.handle(authReq);
    }



    const modifiedRequest = req.clone({
      setHeaders:{
        GUID
      }
    });




    return next.handle(modifiedRequest).pipe(
      tap((event: HttpEvent<any>) => {
        console.log('Incoming HTTP response', event);
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error here
        console.error('error occurred:', error);
        //throw error as per requirement
        return throwError(error);
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          // Handle HTTP errors
          if (err.status === 401) {
            // Specific handling for unauthorized errors         
            console.error('Unauthorized request:', err);
            // You might trigger a re-authentication flow or redirect the user here
            this.authenticationService.logout();
            location.reload();
            
          } else {
            // Handle other HTTP error codes
            console.error('HTTP error:', err);
          }
        } else {
          // Handle non-HTTP errors
          console.error('An error occurred:', err);
        }
  
        // Re-throw the error to propagate it further
        const error = err.error.message || err.statusText;
        return throwError(error); 
      }),


      finalize(() => {
        this.loader.hide();
      }));


      
  }
}


/*
import { HttpHeaders, HttpRequest } from '@angular/common/http';

// Assuming you have a request object and a superAdminToken
const superAdminToken = 'your-super-admin-token-here';

// Original request (this would usually be provided in your code)
const request = new HttpRequest('GET', 'https://api.example.com/data');

// Cloning the request and setting the Authorization header
const modifiedReq = request.clone({
  headers: request.headers.set('Authorization', `Bearer ${superAdminToken}`)
});

// Now you can use modifiedReq in your HTTP operations

*/

/*
const modifiedReq = request.clone({
  headers: request.headers.set('Authorization', `Bearer ${superAdminToken}`)
});

*/

/*
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const superAdminToken = this.authService.getSuperAdminToken();

    // Clone the request and add the new Authorization header
    const modifiedReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${superAdminToken}`)
    });

    return next.handle(modifiedReq);
  }
}

*/

