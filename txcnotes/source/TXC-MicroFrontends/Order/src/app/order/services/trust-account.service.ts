import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from '../models/base-response.model';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrustAccountService {
  constructor(private http: HttpClient) {}

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  getTrustAccount(orderLineId: number) {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `query OrderLineTrustAccount {
                orderLineTrustAccount(where: { orderLineId: { eq: ${orderLineId} } }) {
                  items {
                      id
                      orderLineId
                      trustAccountId
                      trustAccountOption
                      trustAccountBatchNo
                      amount
                      expiryPolicyId
                      expiryDate
                      validFrom
                      validTo
                      createdDateTime
                  }
                }
              }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data)?.orderLineTrustAccount?.items[0];
        }
      })
    );
  }
}
