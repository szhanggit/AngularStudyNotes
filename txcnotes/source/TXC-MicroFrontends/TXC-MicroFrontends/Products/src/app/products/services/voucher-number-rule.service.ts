import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { GetVoucherNumberRuleResponse } from '../models/get-voucher-number-rule.response';
import { TenantConfigService } from './tenant-config.service';
import { TimezoneService } from './timezone.service';

@Injectable({
  providedIn: 'root'
})
export class VoucherNumberRuleService {

  constructor(private http: HttpClient,
    private readonly _authorizationLibraryService: AuthorizationLibraryService,
    private readonly tenantConfigService: TenantConfigService,
    private readonly timezoneService: TimezoneService) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  getSpecificVoucherNumberRule(
    merchantId: number | undefined,
    voucherNumberRuleId: number | undefined
  ) {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query: `query {
        voucherNumberRules(
            where: { 
                voucherNumberRuleId: { eq: ${voucherNumberRuleId} },
                merchantId: { eq: ${merchantId} }
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
                generatedBy
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
    }`
    }
    return this.http.post(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }).pipe(map((res: any) => {
      const parsedRes = JSON.parse(res.data);

      return parsedRes.voucherNumberRules.items?.map((item: any) => ({
        ...item,
        createdDateTime: this.timezoneService.shiftDateTimeByUtcOffset(
          item.createdDateTime,
          this.tenantConfigService.fetchLocalTimeFromUTC()
        ),
      }));
    }))
  }


  // method to get vnr list from GraphQL
  public getVoucherNumberRulesGraphQL(merchantId: number, isEdenredProgram: boolean): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = {
      query:
        `query{
          voucherNumberRules(
            where: {and: [{merchantId: {eq: ${merchantId}}}, {generatedBy: {eq: ${isEdenredProgram? 1 : 2}}}, {isDeleted: {eq: false}}]},
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
            }
          }
        }`
    };
    return this.http.post(url, body,{ headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>;
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
    return this.http.post(url, body,{ headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>;
  }
}
