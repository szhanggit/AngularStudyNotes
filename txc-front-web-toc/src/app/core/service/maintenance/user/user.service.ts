import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/models/common/response-model';
import { CreateUserCommand } from 'src/app/core/models/maintenance/command/user/create-user-command';
import { UpdateUserCommand } from 'src/app/core/models/maintenance/command/user/update-user-command';
import { UpdateUserStatusCmd } from 'src/app/core/models/maintenance/command/user/update-user-status-command';
import { GetUserListQry } from 'src/app/core/models/maintenance/queries/user/get-user-list-query';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly controller = "amm/User";

  constructor(private readonly apiSvc: ApiService) { }

  post(model: CreateUserCommand): Observable<ResponseModel> {
    return this.apiSvc.post(this.controller, model);
  }

  put(model: UpdateUserCommand): Observable<ResponseModel>{
    return this.apiSvc.put(this.controller, model);
  }

  get(model: GetUserListQry) {
    var params = {
      rowCount: model.rowCount,
      pageNumber: model.pageNumber,
      tenantId: model.tenantId,
      appId: model.appId,
      roleId: model.roleId != null ? model.roleId : [],
      searchKey: model.searchKey,
      roleStatus: model.roleStatus,
      userStatus: model.userStatus
    }

    const body = new HttpParams({ fromObject: params })
    return this.apiSvc.get(this.controller, body);
  }

  getById(userId: number) {
    var params = {
      UserId: userId
    }

    const body = new HttpParams({ fromObject: params })
    return this.apiSvc.get(this.controller + '/byId', body);
  }

  updateUserStatus(model: UpdateUserStatusCmd) {
    return this.apiSvc.post(this.controller + '/update-user-status', model);
  }


}
