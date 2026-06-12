import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateRoleCommand } from 'src/app/core/models/maintenance/command/role/create-role-command';
import { UpdateRoleCommand } from 'src/app/core/models/maintenance/command/role/update-role-command';
import { GetRoleListQry } from 'src/app/core/models/maintenance/queries/role/get-role-list-query';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private readonly controller = "amm/Role";

  constructor(private readonly apiSvc: ApiService) { }

  post(model: CreateRoleCommand){
    return this.apiSvc.post(this.controller, model);
  }

  put(model: UpdateRoleCommand){
    return this.apiSvc.put(this.controller, model);
  }

  get(model: GetRoleListQry){
    var params = {
      rowCount: model.rowCount,
      pageNumber: model.pageNumber,
      tenantId: model.tenantId,
      appId: model.appId,
      roleId: model.roleId,
      searchKey: model.searchKey
    }

    const body = new HttpParams({fromObject: params });
    return this.apiSvc.get(this.controller, body);
  }

  getById(roleId: number){
    var params = {
      roleId: roleId
    }
    const body = new HttpParams({ fromObject: params })
    return this.apiSvc.get(this.controller + '/byId', body);
  }
}
