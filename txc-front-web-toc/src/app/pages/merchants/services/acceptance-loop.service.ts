import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../../products/models/base-response';
import { AcceptanceLoop } from '../models/acceptance-loop.model';

@Injectable({
  providedIn: 'root'
})
export class AcceptanceLoopService {

  constructor(private http: HttpClient) { }

  private getHeaders(type: number = 0): HttpHeaders {
    if (type === 0) {
      return new HttpHeaders()
      .set('content-type', 'application/json')
      // default
      .set('TenantName', 'IN')
      .set('TenantBasicInfoId', '2');
    } else {
      return new HttpHeaders()
      // default
      .set('TenantName', 'IN')
      .set('TenantBasicInfoId', '2');
    }
  }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  set(item : AcceptanceLoop){
    localStorage.setItem("AcceptanceLoop", JSON.stringify(item));
  }

  get() : AcceptanceLoop{
    return JSON.parse(localStorage.getItem("AcceptanceLoop"));
  }

  clear(){
    localStorage.removeItem("AcceptanceLoop");
  }


  getAll(pageIndex : number = 0, pageSize : number = 20, searchTerm : string = ""): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query{ acceptanceLoops(tenantId: 2 skip:${pageIndex} take: ${pageSize} where: { code : { contains : \"${searchTerm}\" } }) { totalCount, pageInfo { hasNextPage, hasPreviousPage } items { acceptanceLoopId, code, description, createdBy, createdOn, acceptanceLoopMerchants(tenantId: 2) { merchant(tenantId: 2) { merchantId, name shop(tenantId:2) { shopId, name, status, identityCode } } acceptanceLoopMerchantShops(tenantId: 2) {  shop(tenantId: 2) { shopId, name, status, identityCode } } } } } }`};
    return this.http.post(url, data , { headers: this.getHeaders() }) as Observable<BaseResponse>;
  }

  getAllMerchant(searchTerm : string = ""): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
      merchants(
        tenantId: 2
        order: { name: ASC }
        where: { name: { contains: \"${searchTerm}\" } }
      ) {
        items {
          merchantId
          name
          identityCode
        }
      }
    }`};
    return this.http.post(url, data , { headers: this.getHeaders() }) as Observable<BaseResponse>;
  }

  getAllShopByMerchantId(merchantId : number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
      shops (
        tenantId: 2
        order: { name: ASC }
        where: { merchantId: { eq: ${merchantId} } }
      ) {
        items {
          shopId
          name
          identityCode
          status
        }
      }
    }
    `};
    return this.http.post(url, data , { headers: this.getHeaders() }) as Observable<BaseResponse>;
  }

  create(data : any){
    const url = `${this._getURL()}api/AccLoop/AcceptanceLoop`;
    return this.http.post(url, data , { headers: this.getHeaders() }) as Observable<BaseResponse>;
  }

  edit(data : any){
    const url = `${this._getURL()}api/AccLoop/AcceptanceLoop`;
    return this.http.put(url, data , { headers: this.getHeaders() }) as Observable<BaseResponse>;
  }

}
