import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { catchError, first, map } from 'rxjs/operators';
import { KeySaveRequest } from 'src/app/core/models/key/key-save-request.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class KeyService {

  private controller: string = "amm";
  
  constructor(private apiSvc: ApiService) { 
    
  }

  createKey(parameter : KeySaveRequest)  {
    return  this.apiSvc.post(this.controller + "/key", parameter)    
    .pipe(
      map(data => {    
        return data;
      }),
      catchError(e => {
        if((e.error)){
            console.log(e.error.message);
         }
       return e;
      })
    )
  }
}
