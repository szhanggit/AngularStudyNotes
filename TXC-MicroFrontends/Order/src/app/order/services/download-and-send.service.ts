import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from '../models/base-response.model';
import { Observable, map } from 'rxjs';
import {
  DownloadVoucherRequestBody,
  SendVoucherRequestBody,
} from '../models/download-send.model';

@Injectable({
  providedIn: 'root',
})
export class DownloadAndSendService {
  constructor(private http: HttpClient) {}

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  DownloadOrderVoucherExcel(body: DownloadVoucherRequestBody) {
    const url = `${this.getURL()}api/Order/DownloadOrderVoucherExcel`;
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getClientContact() {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `query ClientContact {
                clientContact {
                  items {            
                    clientId
                    name
                    email
                  }
                }
              }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data)?.clientContact?.items;
        }
      })
    );
  }

  SendOrderVoucherExcel(body: SendVoucherRequestBody) {
    const url = `${this.getURL()}api/Order/SendOrderVoucherExcel`;
    return this.http.post(url, body) as Observable<BaseResponse>;
  }
}
