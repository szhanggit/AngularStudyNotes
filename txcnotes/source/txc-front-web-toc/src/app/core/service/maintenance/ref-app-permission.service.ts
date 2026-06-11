import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/models/common/response-model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class RefAppPermissionService {
  private controller: string = "amm/Reference";

  constructor(private apiSvc: ApiService) { }

  public get(appId: number):Observable<ResponseModel>{
    const params = {
      appId: appId
    }
    const body = new HttpParams({fromObject: params})
    return this.apiSvc.get(this.controller + '/app-permission', body);
  }
}
