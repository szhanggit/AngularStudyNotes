import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient,
  ) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  getDictionariesByIds(dictionaryId: number[], category: string): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `
      query{
        dictionaries(where: {
            and: [
                {category: { eq: "${category}" }}
                {dictionaryId: { in: ${JSON.stringify(dictionaryId)} }}
            ]
        }) {
            category
            dictionaryId
            parentId
            name
            displayName
            dictionaryTranslation {
                displayContent
                dictionaryId
            }
        }
      }`
    }
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getDictionariesByCategory(category: string): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `
      query{
        dictionaries(where: {
            category: { eq: "${category}" }
        }) {
            category
            dictionaryId
            parentId
            name
            displayName
            dictionaryTranslation {
                displayContent
                dictionaryId
            }
        }
      }`
    }
    return this.http.post(url, body) as Observable<BaseResponse>;
  }
}
