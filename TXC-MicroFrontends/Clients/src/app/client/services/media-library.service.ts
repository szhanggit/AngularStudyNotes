import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { TenantConfigService } from './tenant-config.service';

@Injectable({
  providedIn: 'root'
})
export class MediaLibraryService {

  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

    get(keywoard : string = ""): Observable<BaseResponse> {
      const url = `${this._getURL()}api/GraphQL/Query`;
      const data = { query: `query
      {
        media(
          where:{keyword:{contains:"${keywoard}"}})
          {
            items{
              mediaId
              fileName
              fileContentType
              nodeUrl
              account
              blobName
              type
              width
              height
              keyword
            }
          }
        }`};
     
      return this.http.post(url, data , { 
        headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) 
      }) as Observable<BaseResponse>;
    }
}
