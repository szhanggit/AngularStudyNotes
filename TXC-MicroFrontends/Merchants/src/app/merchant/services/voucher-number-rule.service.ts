import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetVoucherNumberRuleAlgorithmResponse, GetVoucherNumberRuleBarCodeResponse, GetVoucherNumberRulePinCodeResponse, GetVoucherNumberRuleVoucherGeneratorResponse } from '../models/get-voucher-number-rule-reference.response';
import { GetVoucherNumberRuleResponse } from '../models/get-voucher-number-rule.response';
import { BaseResponse } from './base-response.model';
import { TenantConfigService } from './tenant-config.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class VoucherNumberRuleService {

  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService,
    private readonly _utilityService: UtilityService
    ) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  getSpecificVoucherNumberRule(
    merchantId: number | undefined | null,
    voucherNumberRuleId: number | undefined | null = null
  ) {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const voucherNumberRuleIdQuery = voucherNumberRuleId
      ? `voucherNumberRuleId: { eq: ${voucherNumberRuleId} }`
      : '';
    const body = {
      query: `query {
        voucherNumberRules(
            where: { 
                ${voucherNumberRuleIdQuery},
                merchantId: { eq: ${merchantId} },
                isDeleted: { eq: false }
            }
            order: { voucherNumberRuleId: DESC }
            take: 20
            skip: 0
        ) {
            totalCount
            items {
                merchantId
                voucherNumberRuleId
                ruleName
                voucherNumberPrefix
                voucherNumberType
                voucherNumberLength
                barcodeType {
                    id
                    description
                },
                voucherGenerator {
                    id
                    description
                },
                barcodeType {
                    id
                    description
                }
                createdBy
                createdDateTime
                algorithmId
                distVoucherNumUnderBarcode
                algorithmId
                requestExpiryDate
                hasMultipleBarcode
                onDemand
                pinType {
                    id
                    description
                }
                contractSKU {
                    id
                }
                vendor {
                    vendorCode
                    name
                    id
                }
            }
        }
    }`,
    };
    return this.http
      .post(url, body, {
        headers: this._authorizationLibraryService.getAMMHeaders(),
      })
      .pipe(
        map((res: any) => {
          const parsedRes = JSON.parse(res.data);
          return parsedRes.voucherNumberRules.items?.map((item: any) => ({
            ...item,
            createdDateTime: this._utilityService.shiftDateTimeByUtcOffset(
              item.createdDateTime,
              this._utilityService.FetchLocalTimeFromUTC()
            ),
          }));
        })
      );
  }

  // method to get vnr algorithms ids
  getVoucherNumberRuleAlgorithmIds(): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query:
        `query{
          voucherNumberAlgorithms(where: { supportMode: { eq: 3 } }) {
            totalCount
            items {
                id
                nameId
            }
          }
        }`
    };
    return this.http.post(url, body,{ headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  // method to get vnr algorithms name by ids
  getVoucherNumberRuleAlgorithmNameByIds(nameIds: number[]): Observable<BaseResponse> {
      const url = `${this._getURL()}api/GraphQL/Query`;
      const body = {
        query:
          `query{
            dictionaries(where: { dictionaryId: { in: [${nameIds}] } }) {
                dictionaryId
                displayName
            }
        }`
      };
      return this.http.post(url, body,{ headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  // method to get vnr barcode types
  getVoucherNumberRuleBarCode(): Observable<GetVoucherNumberRuleBarCodeResponse> {
    const url = `${this._getURL()}api/Merchant/VoucherNumberRule/BarCodeTypeRef`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<GetVoucherNumberRuleBarCodeResponse>;
  }

  // method to get vnr pincode types
  getVoucherNumberRulePinCode(): Observable<GetVoucherNumberRulePinCodeResponse> {
    const url = `${this._getURL()}api/Merchant/VoucherNumberRule/PinTypeRef`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<GetVoucherNumberRulePinCodeResponse>;
  }

  // method to get vnr voucher generators
  getVoucherNumberRuleVoucherGenerator(): Observable<GetVoucherNumberRuleVoucherGeneratorResponse> {
    const url = `${this._getURL()}api/Merchant/VoucherNumberRule/VoucherGeneratorRef`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<GetVoucherNumberRuleVoucherGeneratorResponse>;
  }

  // method to call on create endpoint
  createVoucherNumberRule(body: any, isEdenredProgram: boolean): Observable<BaseResponse> {
    const url = `${this._getURL()}api/Merchant/VoucherNumberRule/${isEdenredProgram ? 'EdenredProgram' : 'ThirdParty'}`;
    return this.http.post(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  // method to call on update endpoint
  updateVoucherNumberRule(body: any, isEdenredProgram: boolean): Observable<BaseResponse> {
    const url = `${this._getURL()}api/Merchant/VoucherNumberRule/${isEdenredProgram ? 'EdenredProgram' : 'ThirdParty'}`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  // method to call delete vnr endpoint
  deleteVoucherNumberRule(id: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/Merchant/VoucherNumberRule/${id}`;
    return this.http.delete(url,  { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  // method to get vnr list from GraphQL
  public getVoucherNumberRulesGraphQL(merchantId: number, isEdenredProgram: boolean): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query:
        `query{
          voucherNumberRules(
            where: {and: [{merchantId: {eq: ${merchantId}}}, {voucherGenerateWay: {eq: ${isEdenredProgram? 1 : 2}}}, {isDeleted: {eq: false}}]},
            order: [{createdDateTime: DESC}]) {
            items {
              voucherNumberRuleId,
              ruleName,
              voucherNumberPrefix,
              voucherNumberType,
              voucherNumberLength,
              distVoucherNumUnderBarcode,
              createdDateTime,
              algorithmId,
              voucherNumberGenerator,
              barcodeType {
                  id,
                  description
              },
              voucherGenerator{
                  id,
                  description
              },
              contractSKU {
                id
              },
              createdBy
            }
          }
        }`
    };
    return this.http.post(url, body,{ headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  // method to get in used vnr list from GraphQL
  public getUsedVoucherNumberRulesGraphQL(merchantId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query:
        `query{
          contractSkuByMerchantId(merchantId: ${merchantId}, valid: true) {
            items {
              voucherNumberRule {
                voucherNumberRuleId,
                ruleName,
                onDemand,
                vendorId
              }
            }
          }
        }`
    };
    return this.http.post(url, body,{ headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
}
