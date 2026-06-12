import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LdaUserModel } from 'src/app/core/models/security/lda-user-model';
import { ResponseModel } from '../../models/common/response-model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class LdapUserService {

  private readonly controller = "amm/LdapUser";
  constructor(private readonly apiSvc:ApiService) { }

  getLdapUser(userSearchString:string): Observable<LdaUserModel>{
    return this.apiSvc.get(`${this.controller}?userSearchString=${userSearchString}`);
  }
  getLdapIfNotExistsUser(userSearchString:string): Observable<ResponseModel>{
    return this.apiSvc.get(`${this.controller}/get-not-existed?userSearchString=${userSearchString}`);
  }
}
