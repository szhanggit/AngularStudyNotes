import { Injectable } from '@angular/core';
import { GraphqlApiService } from './graphql-api.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BaseResponse } from '../models/base-response.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  constructor(
    private readonly graphqlApiService: GraphqlApiService,
    private readonly http: HttpClient
  ) {}

  getExpirationPolicies(generatorEnums: string = '[0,1,2,4,8]') {
    const query = `
      query {
        expirationPolicyByGeneratorEnum (
          generatorEnums : ${generatorEnums}
          order: [{ type: ASC  },{ validPeriod: ASC  }]         
        ) {
            id
            name
            displayName
            validPeriod
            type
            productVoucherGenerator
          }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getProductWizard(wizardKey: string): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ProductWizard/Detail?WizardKey=${wizardKey}`;
    return this.http.get(url) as Observable<BaseResponse>;
  }
}
