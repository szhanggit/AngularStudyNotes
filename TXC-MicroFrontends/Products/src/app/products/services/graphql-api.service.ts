import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class GraphqlApiService {

  private gatewayUrl = `https://${environment.apiUrl}api/GraphQL/Query`;

  constructor(private readonly httpClient: HttpClient,
    private readonly authorizationLibraryService: AuthorizationLibraryService
  ) { }

  public postQuery(graphQlQuery: string, headers?: HttpHeaders): Observable<BaseResponse> {
    const body = { query: graphQlQuery};
    return this.httpClient.post(this.gatewayUrl, body,{ headers }) as Observable<BaseResponse>;
  }

}
