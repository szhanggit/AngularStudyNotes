import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/models/common/response-model';
import { GetRefAppTenantAssigningRoleQry } from '../../models/maintenance/queries/application/get-ref-app-tenant-assigning-role-qry';
import { GetRefAppTenantRoleQry } from '../../models/maintenance/queries/application/get-ref-app-tenant-role-query';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class RefAppTenantRoleService {
  private controller: string = "amm/Reference";

  constructor(private apiSvc: ApiService) { }

  public getAssigningRole(model: GetRefAppTenantAssigningRoleQry):Observable<ResponseModel>{
    const params = {
      tenantId: model.tenantId,
      appId: model.appId
    }
    const body = new HttpParams({fromObject: params})
    return this.apiSvc.get(this.controller + '/assigning-role', body);
  }

  public getAppTenantRole(model: GetRefAppTenantRoleQry):Observable<ResponseModel>{
    const params = {
      tenantId: model.tenantId,
      appId: model.appId
    }
    const body = new HttpParams({fromObject: params})
    return this.apiSvc.get(this.controller + '/role', body);
  }
}
