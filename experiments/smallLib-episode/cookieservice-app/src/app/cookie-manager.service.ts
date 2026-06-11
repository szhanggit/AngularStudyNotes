import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieManagerService {

  constructor(private cookieService : CookieService) {

  }

  getCookie(key : string) : any {
    let cookie : string = this.cookieService.get(key) === ""  ? null : JSON.parse(this.cookieService.get(key));
    return cookie;
  }

  setCookie(key : string, model : any)  {
    this.cookieService.set(key, JSON.stringify(model) ,{path : "/"});
  }

  deleteCookie(key : string) {
    this.cookieService.delete(key,"/");
  }

  deleteAllCookie(){
    this.cookieService.deleteAll();
  }

}
