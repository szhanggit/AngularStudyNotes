import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { Observable, map } from 'rxjs';
import { Dictionary } from '../models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  constructor(private http: HttpClient) {}

  private _getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  getChannels(): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `query {
        dictionaries (where: { category: { eq: "Channel"}}) { 
          dictionaryId,
          name,
          displayName 
        }
      }`,
    };
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getLanguages(): Observable<Dictionary[]> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `
      query { 
        dictionaries (where: { category: { eq: "CultureCode"}}) { 
          dictionaryId,
          name,
          displayName 
        }
      }`,
    };
    return (
      this.http.post(url, body) as Observable<BaseResponse>
    ).pipe(map((response) => JSON.parse(response.data).dictionaries));
  }
}
