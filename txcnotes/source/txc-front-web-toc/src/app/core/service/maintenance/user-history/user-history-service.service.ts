import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetUserHistoryByIdQry } from 'src/app/core/models/maintenance/queries/user/get-user-history-by-id-query';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class UserHistoryService {

  private readonly controller = "amm/UserHistory";

  constructor(private readonly apiSvc: ApiService) { }

  get(model: GetUserHistoryByIdQry) {
    var params = {
      userId: model.userId,
      tenantId: model.tenantId,
      appId: model.appId
    }

    const body = new HttpParams({ fromObject: params })
    return this.apiSvc.get(this.controller, body);
  }


}