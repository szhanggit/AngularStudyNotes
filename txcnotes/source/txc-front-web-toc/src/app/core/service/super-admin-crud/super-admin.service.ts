
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateSuperAdminCommand } from 'src/app/core/models/super-admin-crud/request/create-super-admin-command.model';
import { ResponseModel } from '../../models/common/response-model';
import { GetAllSuperAdminQry } from '../../models/super-admin-crud/request/get-all-super-admin-qry.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  private readonly controller = "amm/SuperAdmin";

  constructor(private readonly apiSvc: ApiService) {

  }

  createSuperAdmin(model : CreateSuperAdminCommand) {
     return this.apiSvc.post(this.controller, model);
  }

  getSuperAdmin(model: GetAllSuperAdminQry):Observable<ResponseModel> {
    var params = {
      rowCount: model.rowCount,
      pageNumber: model.pageNumber,
      searchKey: model.searchKey,
      roleStatus: model.roleStatus,
      userStatus: model.userStatus
    }

    const body = new HttpParams({ fromObject: params })

    return this.apiSvc.get(this.controller, body);
  }
}
