import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../models/common/response-model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class AmmTokenService {

  private readonly controller = "Token";
  constructor(private readonly apiSvc:ApiService,
    private readonly httpClient: HttpClient) { }

  //todo: need changed url once the gateway api are finalized

  // getUserClaim(): Observable<ResponseModel>{
  //   return this.apiSvc.get(this.controller);
  // }

  getAmmToken(): Observable<any>{
    return this.httpClient.get("http://localhost:30103/api/Token?AppId=1");
  }
}
