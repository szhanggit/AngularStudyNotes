import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  getReservationCode(skuIds: number[]) {
    const ids = skuIds.join(',');
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `{
        inventorySKUBatches(where: { skuId: { in: [${ids}] } }) {
          items {
              skuId
              inventoryBatch {
                  id
                  reservationCode
              }
          }
        }
      }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data)?.inventorySKUBatches.items;
        }
      })
    );
  }
}
