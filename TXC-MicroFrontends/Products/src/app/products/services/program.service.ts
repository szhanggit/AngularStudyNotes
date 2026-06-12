import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(private http: HttpClient,
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
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }

  // get program by Id query and using graphql endpoint
  getProgramById(id: number): Observable<BaseResponse> {
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
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body, { headers }) as Observable<BaseResponse>;
  }
}
