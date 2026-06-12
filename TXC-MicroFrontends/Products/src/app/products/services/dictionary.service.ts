import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private http: HttpClient) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  // get dictionary items by category using graphql endpoint
  getDictionaryItemsByCategory(category: string): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `query{dictionaries (where: { category: { eq: "${category}"}}) { dictionaryId name displayName }}`
    }
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }
}
