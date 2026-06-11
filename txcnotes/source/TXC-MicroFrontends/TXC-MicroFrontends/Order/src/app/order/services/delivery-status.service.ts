import { Injectable } from '@angular/core';
import { SyncStatusHistory, SyncStatusRequest } from '../models/sync-status-history.model';
import { TemplateTypeEnum } from 'src/app/shared/enums/template.enum';
import { DeliveryStatus } from '../models/delivery-status.model';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from '@txc-angular/component-library';

@Injectable({
  providedIn: 'root',
})
export class DeliveryStatusService {
  
  MOCK_SMS_STATUS: DeliveryStatus[] = [
    {
      status: '已送達手機',
      quantity: 1,
    },
  ];

  MOCK_EMAIL_STATUS: DeliveryStatus[] = [
    {
      status: 'Delivered',
      quantity: 2,
    },
    {
      status: 'Softbounces',
      quantity: 1,
    },
  ];

  constructor(private http: HttpClient) {}

  getDeliveryStatus(event: number): DeliveryStatus[] {
    return event === TemplateTypeEnum.SMS
      ? [...this.MOCK_SMS_STATUS]
      : [...this.MOCK_EMAIL_STATUS];
  }

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  getOrderDistributionStatusHistory(orderId: number, templateType: number) {
    const actionType = templateType === TemplateTypeEnum.SMS ? 'SMSSync' : 'EmailSync';
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `query OrderDistributionStatusHistory {
        orderDistributionStatusHistory(
          orderId: ${orderId} 
          where: { actionType: { eq: "${actionType}" } }
        ) {
          totalCount
          items {
              id
              orderId
              actionType
              actionResult
              actionTime
              operator
          }
        }
      }
      `,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data)?.orderDistributionStatusHistory
            ?.items;
        }
      })
    );
  }

  SyncOrderDistributionStatus(body: SyncStatusRequest) {
    const url = `${this.getURL()}api/Order/SyncOrderDistributionStatus`;
    return this.http.post(url, body) as Observable<BaseResponse>;
  }
}
