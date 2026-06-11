import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/models/common/response-model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class RefRoleService {
  private controller: string = "Role"

  constructor(private apiSvc: ApiService) { }

  // public get(tenantId: number, appId: number):Observable<ResponseModel>{
  //   const params = {
  //     tenantId: tenantId,
  //     appId: appId
  //   }
  //   const body = new HttpParams({fromObject: params})
  //   return this.apiSvc.get(this.controller, body);
  // }

  public get(searchKey: string, rowCount: number, tenantId: number, appId: number, roleId: number):Observable<ResponseModel>{
    const params = {
      searchKey: searchKey,
      rowCount: rowCount,
      tenantId: tenantId,
      appId: appId,
      roleId: roleId
    }
    const body = new HttpParams({fromObject: params})
    return this.apiSvc.get(this.controller, body);
  }
}
