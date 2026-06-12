import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { GetUserRoleListQuery } from 'src/app/core/models/user-role/request/get-user-role-list-query.model';
import { GetUserRoleListResponse } from 'src/app/core/models/user-role/response/get-user-role-list-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  private readonly controller = "UserRole";

  constructor(private readonly apiSvc: ApiService) {

  }

  getUserRoles(parameter : GetUserRoleListQuery) : Observable<GetUserRoleListResponse>{
    let param = "?";
    const p = parameter as any;
    const keys = Object.keys(p);
    keys.forEach((fe,i)=>
    {
      if(i < keys.length -1){
        param += `${fe}=${p[fe]}&`;
      } else{
        param += `${fe}=${p[fe]}`;
      }

    });
    return this.apiSvc.get(this.controller + param);
  }
}
