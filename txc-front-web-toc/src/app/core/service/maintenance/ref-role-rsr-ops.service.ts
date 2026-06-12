import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/models/common/response-model';
import { GetRefRoleRsrOpsQry } from '../../models/maintenance/queries/role/get-ref-role-rsr-ops-query';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class RefRoleRsrOpsService {
  private controller: string = "amm/Reference"

  constructor(private apiSvc: ApiService) { }

  public get(model: GetRefRoleRsrOpsQry):Observable<ResponseModel>{
    const params = {
      tenantId: model.tenantId,
      appId: model.appId
    }
    const body = new HttpParams({fromObject: params})
    return this.apiSvc.get(this.controller + '/role-res-ops', body);
  }
}
