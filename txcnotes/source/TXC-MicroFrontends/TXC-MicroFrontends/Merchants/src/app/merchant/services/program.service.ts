import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TenantConfigService } from './tenant-config.service';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable } from 'rxjs';
import { BaseResponse } from './base-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  // get all programs programs query and using graphql endpoint
  getAllProgram(): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: 'query{allProgramsByTenantId { id name displayName isEdenred}}'
    }
    return this.http.post(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  // get program by Id query and using graphql endpoint
  getProgramId(id: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = { query:
      `query {
          programs (
              where: { id: { eq: ${id}} }
          ) {
              items {
                  id
                  name
                  displayName
                  isEdenred
              }
          }
      }`
    }
    return this.http.post(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
}
