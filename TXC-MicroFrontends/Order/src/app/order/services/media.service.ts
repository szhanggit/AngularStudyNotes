import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  private _getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  // get media by id using graphql endpoint
  getMediaById(id: number): Observable<BaseResponse> {
    if (isNaN(id)) {
      return of({ success: false } as BaseResponse);
    }

    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `query{ mediaById(mediaId: ${id}) { account, blobName, fileContentType, fileName, height, keyword, mediaId, nodeUrl, type, width }}`,
    };
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }

  // get media by list of ids using graphql endpoint
  getMediaByIdList(mediaIds: number[]): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const ids = mediaIds.join(',');
    const body = {
      query: `query{allMediaURL(take : 100 
          where : {
              mediaId :{in:[${ids}]}
          }
      ) {items {  account, blobName, fileContentType, fileName, height, keyword, mediaId, nodeUrl, type, width}}}`,
    };
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }

  // get media by keyword using graphql endpoint
  getMediaByKeyword(keyword: string): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `query{mediaByKeyword(keyword: "${keyword}") { account, blobName, fileContentType, fileName, height, keyword, mediaId, nodeUrl, type, width}}`,
    };
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }

  getImagesBySearchTerm(searchTerm: string) {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `
      query {
        media(
            where: {
                and: [
                    {keyword: { contains: "${searchTerm}"}}
                    {fileContentType: {in: ["image/png", "image/jpeg"]}}
                ]
            }
            order: { mediaId: DESC }
            skip: 0
            take: 10
        ) {
            totalCount
            items {
                account
                blobName
                fileContentType
                fileName
                height
                width
                mediaId
                keyword
                mediaId
                nodeUrl
                type
            }
        }
    }`,
    };
    return this.http.post(url, body) as Observable<BaseResponse>;
  }
}
