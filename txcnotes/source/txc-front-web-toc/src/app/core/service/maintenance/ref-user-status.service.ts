import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/models/common/response-model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class RefUserStatusService {

  private controller: string = "amm/Reference";

  constructor(private apiSvc: ApiService) { }

  public get():Observable<ResponseModel>{
    return this.apiSvc.get(this.controller + '/user-status');
  }
}
