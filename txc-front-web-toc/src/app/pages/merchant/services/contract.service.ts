import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../../products/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

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


  getAll(pageIndex : number = 0, pageSize : number = 20, searchTerm : string = "", contractStatus : number, valid : boolean = true,  merchantId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
        contracts(
          merchantId: ${merchantId}
          tenantId: 2
          valid : ${valid}
          contractStatus : ${contractStatus}
          keyword : \"${searchTerm}\"
          skip: ${pageIndex}
          take: ${pageSize}
        ) {
            totalCount

          items {
            contractId
      
            contractName
      
            startDate
      
            endDate

            contractNumber
      
            contractPaymentTerm(tenantId: 2) {
              id
      
              value
            }
      
            contractPriceOption(tenantId: 2) {
              id
      
              value
            }
      
            contractCostScheme(tenantId: 2) {
              id
      
              value
            }
      
            costPercentage
      
            contractCostRoundingRule(tenantId: 2) {
              id
      
              value
            }
      
            skuQuantity
      
            statusId
          }
        }
      }`};
    return this.http.post(url, data , { headers: this.getHeaders() }) as Observable<BaseResponse>;
  }
}
