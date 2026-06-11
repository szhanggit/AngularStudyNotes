import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  // get all brands using graphql endpoint
  getAllBrands(take = 100): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `query{brands(skip:0, take:${take}){ items{ brandName, createdBy, createdOn, id, mediaId, status }, totalCount}}`
    }
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }

  getBrandsByBrandName(brandName: string): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `query{brandsByName(skip:0, take:10, brandName: "${brandName}"){ items{ brandName, createdBy, createdOn, id, mediaId, status }, totalCount}}`
    }
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }

  getBrandsByBrandID(brandId: number) : Observable<BaseResponse>{
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query : `query{brands(skip: 0, take: 1, where:{id:{eq:${brandId}}}){items{id,brandName,createdBy,createdOn,mediaId,status}}}`
    }
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, {headers}) as Observable<BaseResponse>;
  }
}
