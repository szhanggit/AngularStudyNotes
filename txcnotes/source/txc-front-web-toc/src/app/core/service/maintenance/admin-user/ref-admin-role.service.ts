import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/models/common/response-model';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class RefAdminRoleService {
  private controller: string = "amm/Reference";

  constructor(private apiSvc : ApiService) { }

  public get(tenantId: number, appId: number):Observable<ResponseModel>{
    const params = {
      tenantId: tenantId,
      appId: appId
    }
    const body = new HttpParams({fromObject: params})
    return this.apiSvc.get(this.controller + '/admin-role', body);
  }

}
