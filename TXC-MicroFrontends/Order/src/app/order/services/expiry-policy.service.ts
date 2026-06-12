import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpiryPolicyService {

  constructor(private http: HttpClient) { }

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  getExpirationPolicies() {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `{
        expirationPolicies {
          id
          name
        }
      }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data)?.expirationPolicies;
        }
      })
    );
  }
}
