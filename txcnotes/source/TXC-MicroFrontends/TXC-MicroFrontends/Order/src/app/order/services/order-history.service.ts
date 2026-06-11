import { Injectable } from '@angular/core';
import { OrderHistory } from '../models/order-history.model';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from '../models/base-response.model';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  MOCK_HISTORY: OrderHistory[] = [
    {
      action: OrderStatusEnum.SentFile,
      operator: 'praymark',
      time: '2023/01/09 09:17 AM',
    },
    {
      action: OrderStatusEnum.Published,
      operator: 'System',
      time: '2023/01/08 09:17 AM',
    },
    {
      action: OrderStatusEnum.Publishing,
      operator: 'System',
      time: '2023/01/07 09:17 AM',
    },
    {
      action: OrderStatusEnum.Approved,
      operator: 'bfeliciano',
      time: '2023/01/06 09:17 AM',
    },
    {
      action: OrderStatusEnum.UnderReview,
      operator: 'bfeliciano',
      time: '2023/01/05 09:17 AM',
    },
    {
      action: OrderStatusEnum.Rejected,
      operator: 'bfeliciano',
      time: '2023/01/04 09:17 AM',
    },
    {
      action: OrderStatusEnum.Created,
      operator: 'praymark',
      time: '2023/01/03 09:17 AM',
    },
  ];
  constructor(private http: HttpClient) {}

  getOrderHistory(): OrderHistory[] {
    return [...this.MOCK_HISTORY];
  }

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  getOrderActionHistories(orderId: number) {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `{
        orderActionHistories (where: {orderId: {eq: ${orderId}}}) {
          items {
            operator
            result
            createdDateTime
            comment
          }
          totalCount
        }
      }
      `,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data)?.orderActionHistories?.items;
        }
      })
    );
  }
}
