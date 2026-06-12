import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class SkuService {
  constructor(
    private http: HttpClient
  ) {}

  private _getURL(): string {
    let splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  // get sku by Id query and using graphql endpoint
  getSKUbyMerchantId(
    merchantId: number,
    productType: number
  ): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `{ 
        contractSkuByMerchantId(merchantId: ${merchantId}, valid: true, where: {typeId: {eq : ${productType} }}) 
          { items 
            { id skuName skuNumber faceValueWithTax multiplier createdBy 
              skuType { id value } 
              voucherNumberRule { voucherNumberRuleId ruleName onDemand vendorId } 
              contractSKUCosts { 
                costWithTax costWithoutTax validStartDate validEndDate createdBy createdDateTime 
                skuCostContract { contractId contractName contractNumber creator costSchemeId } 
                contractSkuStatus { id value } 
              } 
            } 
          }
      }`,
    };
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getSKUbySKUId(skuId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `query{ contractSKUDetails(where: { id:{eq: ${skuId}}})
        { items
          { id, skuName, skuNumber, faceValueWithTax, faceValueWithoutTax, multiplier, merchantGroupId,
            skuType { id value } 
            voucherNumberRule { voucherNumberRuleId ruleName onDemand vendorId } 
            contractSKUCosts { id, costWithTax, costWithoutTax, validStartDate, validEndDate, 
              skuCostContract { contractId, contractName, contractNumber, costSchemeId, startDate, endDate, merchantId, merchant { name } } } } }}`,
    };
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getSKUSmartSearch(
    merchantId: number,
    typeId: number,
    keyword: string = ''
  ): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `{\tcontractSkuByMerchantId(merchantId: ${merchantId}, valid: true where: { and: [ { typeId: { eq: ${typeId} } } {or: [ { skuName: { contains: \"${keyword}\" } } { skuNumber: { contains: \"${keyword}\"} } ] } ] } take: 20) { items { id skuName skuNumber faceValueWithTax multiplier createdBy skuType { id value } voucherNumberRule { voucherNumberRuleId ruleName onDemand vendorId } contractSKUCosts { costWithTax costWithoutTax validStartDate validEndDate createdBy createdDateTime skuCostContract { contractId contractName contractNumber creator costSchemeId } contractSkuStatus { id value } } } }}`
    };
    return this.http.post(url, body) as Observable<BaseResponse>;
  }
}
