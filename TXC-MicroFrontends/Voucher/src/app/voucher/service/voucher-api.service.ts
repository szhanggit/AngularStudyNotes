import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphqlApiService } from './graphql-api.service';
import { Observable, of } from 'rxjs';
import { BaseResponse } from './base-response.model';
import { DistributionTypeEnum } from '../enum/distribution-type';
import { SkuDetailSourceTypeEnum } from '../enum/product-type.enum';
import { environment } from 'src/environments/environment';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';

@Injectable({
  providedIn: 'root'
})
export class VoucherApiService {
  readonly skuDetailSourceTypeEnum = SkuDetailSourceTypeEnum;

  constructor(
    public readonly http: HttpClient,
    public readonly graphqlApiService: GraphqlApiService,
    private readonly authLibService: AuthorizationLibraryService,
  ) { }

  public _getURL(): string {
    return "https://" + environment.apiUrl;
  }

  /** Voucher */
  voucherListItems = `
    totalCount
    items {
        id
        voucherNumberMask
        stateId
        issuedOn
        balance
        activatedOn
        expiryOn
        stateDescription
        frozenAmount
        orderLineDetail {
            mobile
            email
            activeDate
            orderLine {
                order {
                    id
                    status
                    clientId
                    orderNumber
                    publishDateTime
                    client {
                        id
                        clientName
                        identityCode
                    }
                    orderLines {
                        orderId
                        productVersion {
                            product {
                              productName
                              productId
                              productType
                            }
                        }
                    }        
                }
            }
        }
        alias {
            alias
        }
        eCode {
            voucherId
            eCode
        }
        guid {
            guid
        }
    }`
  getVoucherListByGuid(guid: any): Observable<BaseResponse> {
    const query = `
    query {
        vouchersByGUIDs(
          guids: "${guid}"
          where: { stateId: { nin: [1, 15] } }
        ) {
          ${this.voucherListItems}
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getVoucherListByGcid(gcid: any): Observable<BaseResponse> {
    const query = `
    query {
      vouchersByGcid(gcid: "${gcid}") 
      {
          ${this.voucherListItems}
        }
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getVoucherListByAlias(alias: any): Observable<BaseResponse> {
    const query = `
  query {
    vouchersByAliases(
      aliases:"${alias}"
      where: { stateId: { nin: [1, 15] } }
    ){
      ${this.voucherListItems}
    }
}`;
    return this.graphqlApiService.postQuery(query);
  }


  getVoucherListByVoucherNumber(voucherNumber: any): Observable<BaseResponse> {
    const query = `
    query {
      vouchersByVoucherNumber(
        voucherNumber: "${voucherNumber}"
        where: { stateId: { nin: [1, 15] } }
      ) {
        ${this.voucherListItems}
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getVoucherListByEcode(eCode: any): Observable<BaseResponse> {
    const query = `
    query {
      vouchersByeCode(
        eCode: "${eCode}"
        where: { stateId: { nin: [1, 15] } }
      ) {
        ${this.voucherListItems}
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  updateVoucherMemo(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/Voucher/UpdateVoucherMemos`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  getVoucherMemo(guid: any): Observable<BaseResponse> {
    const query = `
    query {
        vouchersByGUIDs(guids: "${guid}") {
            items {
                id
                memo
            } 
        }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getVoucherDetails(guid: any): Observable<BaseResponse> {
    const query = `
    query {
        vouchersByGUIDs(guids: "${guid}") {
          items {
            id
            capturedCount
            voucherNumberMask
            memo
            issuedOn
            stateDescription
            stateId
            balance
            expiryOn
            activatedOn
            frozenAmount   
            orderLineDetail {
                email
                mobile
                orderLine {
                    order {
                        orderNumber
                        clientQuotationId
                        memo
                        publishDateTime
                        client {
                            memo
                            clientName
                        }
                    }
                    productVersion {
                        product {
                            skuId
                            productType
                            customerServiceNote
                            contractSKU {
                                skuName
                                skuNumber
                                contractSKUCosts {
                                    skuCostContract {
                                        merchant {
                                            memo
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            combo {
              id
              capturedCount
              voucherNumberMask
              stateId
              stateDescription
              balance
              issuedOn
              activatedOn
              frozenAmount   
              guid {
                guid
              }
              associationStatusId
              associationStatus {
                id
                status
              }
              orderLineDetail {
                  faceValue
                  orderLine {
                      productVersion {
                          productName
                      }
                  }
              }
            }
            masterVoucherId
              master {
                  voucherNumberMask
                  stateId
                  stateDescription
                  balance
                  issuedOn
                  activatedOn
                  frozenAmount   
                  guid {
                    guid
                  }
                  orderLineDetail {
                      orderLine {
                          productVersion {
                              productName
                          }
                      }
                  }
              }
          }
        }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getVoucherHistoryByAuditLog(voucherId: number | null = null): Observable<BaseResponse> {
    const query = `
    query {
      auditLogs(where: { entityId: { eq: ${voucherId} } }) {
        totalCount
        items {
            id
            entityId
            who
            microService
            module
            action
            requestPayloadInfo
            responsePayloadInfo
            date
            actionDate
            discriminator
        }
      }
    }`;
    const regularHeaders: HttpHeaders = this.authLibService.getAMMHeaders();
    const headers: HttpHeaders = regularHeaders.append('MicroService', 'Voucher');
    return this.graphqlApiService.postQuery(query, headers);
  }

  dissociateChildVoucher(voucherId: number) {
    const body = {
      voucherId: voucherId
    }
    const url = `${this._getURL()}api/Voucher/DissociateChildVoucher`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  // TX2 API
  getQuotationDetails(tenant: string, quotationId: number) {
    const quotationIdQuery = `?quotationId=${quotationId}`
    const apiUrl = `https://staging-txcapi-${tenant}.preprod.edenred.net/quotation${quotationId ? quotationIdQuery : ''}`;
    return this.http.get(apiUrl)
  }

  getVoucherHistoryDetailsByVoucherIds(voucherId: number): Observable<BaseResponse> {
    const query = `
    query {
      denormalizedTransition( voucherIds:[${voucherId}] ) {
        totalCount
        items {
            id
            voucherId
            voucherIdPartitionNumber
            merchantId
            shopId
            amount
            actionTime
            action
            tranCode
            operator
            rsv1
            businessDate
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  // Dummy API
  getServiceProviderList(tenantName: string, type: string) {
    const distributionTypeEnum = DistributionTypeEnum;
    const emailResult = [
      {
        tenantName: 'GL',
        provider: [
          {
            id: 1,
            name: 'Infobip'
          }
        ]
      },
      {
        tenantName: 'IN',
        provider: [
          {
            id: 1,
            name: 'SendinBlue'
          },
          {
            id: 2,
            name: 'NetCore'
          }
        ]
      },
      {
        tenantName: 'TW',
        provider: [
          {
            id: 1,
            name: 'SendinBlue'
          }
        ]
      },
      {
        tenantName: 'SG',
        provider: [
          {
            id: 1,
            name: 'SendinBlue'
          }
        ]
      },
      {
        tenantName: 'GL',
        provider: [
          {
            id: 1,
            name: 'Infobip'
          }
        ]
      },
      {
        tenantName: 'GR',
        provider: [
          {
            id: 1,
            name: 'SendinBlue'
          }
        ]
      },
    ];

    const smsResult = [
      {
        tenantName: 'GL',
        provider: [
          {
            id: 1,
            name: 'Infobip'
          }
        ]
      },
      {
        tenantName: 'IN',
        provider: [
          {
            id: 1,
            name: 'Solutionsinfini'
          },
          {
            id: 2,
            name: 'NetCore'
          }
        ]
      },
      {
        tenantName: 'TW',
        provider: [
          {
            id: 1,
            name: 'ExpressSMS'
          }
        ]
      },
      {
        tenantName: 'SG',
        provider: [
          {
            id: 1,
            name: 'SendinBlue'
          }
        ]
      },
      {
        tenantName: 'GL',
        provider: [
          {
            id: 1,
            name: 'Infobip'
          }
        ]
      },
      {
        tenantName: 'GR',
        provider: [
          {
            id: 1,
            name: 'ExpressSMS'
          }
        ]
      },
    ];
    const res = type === distributionTypeEnum.EMAIL ? emailResult : smsResult;
    return of(res.filter(e => e.tenantName === tenantName));
  }
}
