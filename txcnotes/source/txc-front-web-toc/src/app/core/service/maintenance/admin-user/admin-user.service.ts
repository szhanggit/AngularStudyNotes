import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/models/common/response-model';
import { CreateAdminCmd } from 'src/app/core/models/maintenance/command/admin-user/create-admin-cmd';
import { UpdateAdminUser } from 'src/app/core/models/maintenance/command/admin-user/update-admin-user';
import { GetAdminUserListQry } from 'src/app/core/models/maintenance/queries/admin-user/get-admin-user-list-qry';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  private readonly controller = "amm/Admin";

  constructor(private readonly apiSvc: ApiService) { }

  post(model: CreateAdminCmd){
    return this.apiSvc.post(this.controller, model);
  }

  get(model: GetAdminUserListQry):Observable<ResponseModel> {
    var params = {
      rowCount: model.rowCount,
      pageNumber: model.pageNumber,
      tenantId: model.tenantId,
      appId: model.appId,
      searchKey: model.searchKey,
      roleStatus: model.roleStatus,
      userStatus: model.userStatus
    }

    const body = new HttpParams({ fromObject: params })

    return this.apiSvc.get(this.controller, body);
  }

  getById(userId: number):Observable<ResponseModel> {
    var params = {
      UserId: userId
    }

    const body = new HttpParams({ fromObject: params })
    return this.apiSvc.get(this.controller + '/byId', body);
  }

  put(model: UpdateAdminUser){
    return this.apiSvc.put(this.controller, model);
  }

}
