import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphqlApiService } from './graphql-api.service';
import { Observable } from 'rxjs';
import { BaseResponse } from './base-response.model';
import { getInventoryListRequestInterface } from '../interface/request-interface';
import { SkuDetailSourceTypeEnum } from '../enum/product-type.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {
  readonly skuDetailSourceTypeEnum = SkuDetailSourceTypeEnum;

  constructor(
    public readonly http: HttpClient,
    public readonly graphqlApiService: GraphqlApiService,
  ) { }

  edenredQuery: string = `{ voucherNumberRule: { voucherGenerateWay: { eq: 1 } } }`;
  importQuery: string =
    `{voucherNumberRule: {
    voucherGenerateWay: { eq: 2 }
    onDemand: { eq: false }
} }`;
  tpcQuery: string =
    `{voucherNumberRule: {
    voucherGenerateWay: { eq: 2 }
    onDemand: { eq: true }
} }`;

  public _getURL(): string {
    return "https://" + environment.apiUrl;
  }
  /** Inventory */
  getProductListBySkuId(skuId: number, takeAmount: number = 100): Observable<BaseResponse> {
    const query = `
    query {
      productInfo(where: {
          skuId: {
              eq:${skuId}
          }
      }
          take: ${takeAmount}
          order: [{ productCode: DESC }]
      ) {
          totalCount
          items
          {
              productName
              productCode
              productId
              productType
          }
      }
  }`;
    return this.graphqlApiService.postQuery(query);
  }

  getSkuDetailsBySkuId(skuId: number): Observable<BaseResponse> {
    const query = `
        query {
      skuById(skuId: ${skuId}) {
          contractSKUCosts {
              costWithTax
              validStartDate
              validEndDate
                skuCostContract {
                      merchant {
                          name
                          merchantId
                      }
                  }
          }
          skuName
          skuNumber
      }
  }`;
    return this.graphqlApiService.postQuery(query);
  }


  getTpcInventory(skuId: number, take: number, skip: number): Observable<BaseResponse> {
    const query = `
      query {
        inventoryTPCAggregations (
          take:${take}
          skip:${skip}
          where: {skuId :{eq:${skuId}}}) {    
          totalCount
          pageInfo {
            hasNextPage
          }    
          items {
              skuId
              expiryDate
              remainingQuantity
          }    
        }  
      }`;
    return this.graphqlApiService.postQuery(query);
  }

  getImportInventory(skuId: number, take: number, skip: number): Observable<BaseResponse> {
    const query = `
    query {    
      inventoryImportAggregations (
        take:${take}
        skip:${skip}
        order: [{ expiryDate: DESC }, { trustAccountEndDate: DESC }]
        where: {
          skuId :{eq:${skuId}}
          remainingQuantity: { gt: 0 }      
      }) {       
        totalCount
        pageInfo {
          hasNextPage
        } 
        items {          
            issueAvailableStartDate
            issueAvailableEndDate
            expiryDate
            trustAccountEndDate
            remainingQuantity
        }    
      }        
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getEdenredInventory(skuId: number, take: number, skip: number, reservationCode?: string): Observable<BaseResponse> {
    const reservationCodeQuery = `reservationCode: { eq: "${reservationCode}" }, `
    const query = `
    query {  
      inventoryBatches (
        take:${take}
        skip:${skip}
        where: { 
          ${reservationCode ? reservationCodeQuery : ''}
          skuId: { eq: ${skuId} } 
        }
        order: [{ createdOn: DESC }]
      ) {    
          totalCount
          pageInfo {
            hasNextPage
          }     
          items {
            skuId
            reservationCode
            remainingQuantity
            expiryDate
            isDefault
        } 
        }        
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getEdenredRemainingQtyByReservationCode(skuId: number, reservationCode: string): Observable<BaseResponse> {
    const query = `
    query {  
      inventoryEdenredAggregations(where: { 
        skuId: { eq: ${skuId} }
        reservationCode: { eq: "${reservationCode}" } 
      }) {
        items {
            remainingQuantity
        }
    }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getImportRemainingQtyByDates(skuId: number, body: any, hasTrustAccountDate: boolean = false): Observable<BaseResponse> {
    const dateQuery = 
    `issueAvailableStartDate: { eq: ${body.issueAvailableStartDate? `"${body.issueAvailableStartDate}"`: null} }
     issueAvailableEndDate: { eq: ${body.issueAvailableEndDate? `"${body.issueAvailableEndDate}"`: null} }
     expiryDate: { eq: ${body.expiryDate? `"${body.expiryDate}"`: null}  }`;
    const trustAccountEndDateQuery = `trustAccountEndDate: { eq: ${body.trustAccountEndDateQuery? `"${body.trustAccountEndDateQuery}"`: null} }`;
    const query = `
    query {  
      inventoryImportAggregations(
          where: {
              skuId: { eq: ${skuId} }
              ${dateQuery}
              ${hasTrustAccountDate ? trustAccountEndDateQuery: ''}
          }
      ) {
          totalCount
          items {
              remainingQuantity
          }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getSaftyStockQty(skuId: number): Observable<BaseResponse> {
    const query = `
    query {  
      inventoryBatches(where: { isDefault: { eq: true }, skuId: { eq: ${skuId} } }) {
        totalCount
        items {
            isDefault
            remainingQuantity
        }
      }  
    }`;
    return this.graphqlApiService.postQuery(query);
  }


  getSkuIdsBySourceOrSkuCodeOrName(type: SkuDetailSourceTypeEnum, skuCode: string, skuName: string, takeAmount: number, skipAmount: number): Observable<BaseResponse> {
    const skuCodeQuery = skuCode ? `{skuNumber: { eq: "${skuCode}" }}` : '';
    const skuNameQuery = skuName ? `{skuName: { contains: "${skuName}" }}` : '';

    let sourceQuery = '';

    switch (type) {
      case SkuDetailSourceTypeEnum.EDENRED: {
        sourceQuery = this.edenredQuery;
        break
      }
      case SkuDetailSourceTypeEnum.IMPORT: {
        sourceQuery = this.importQuery;
        break
      }
      case SkuDetailSourceTypeEnum.TPC: {
        sourceQuery = this.tpcQuery;
        break
      }
    }

    const query = `
    query {
      contractSKUDetails(
        take: ${takeAmount}
        skip: ${skipAmount}
        where: { and: [
          ${skuCodeQuery} ${skuNameQuery}
          ${sourceQuery}
        ] }
      ) {
        totalCount
        pageInfo {
          hasNextPage
        }
        items {
          id
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getSkuIdsByProductCode(productCode: string): Observable<BaseResponse> {
    const query = `
    query {
      products(
        take: 50
        skip: 0
        where: { 
          productCode: { eq: "${productCode}" } 
        }) {
        totalCount
        pageInfo {
          hasNextPage
        }
        items {
          skuId
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getSkuIdByMercahntName(merchantName: string, type: SkuDetailSourceTypeEnum, take: number, skip: number): Observable<BaseResponse> {
    let sourceQuery = '';
    switch (type) {
      case SkuDetailSourceTypeEnum.EDENRED: {
        sourceQuery = this.edenredQuery;
        break
      }
      case SkuDetailSourceTypeEnum.IMPORT: {
        sourceQuery = `${this.importQuery}`;
        break
      }
      case SkuDetailSourceTypeEnum.TPC: {
        sourceQuery = `${this.tpcQuery}`;
        break
      }
      case SkuDetailSourceTypeEnum.ALL: {
        sourceQuery = '';
        break
      }
    }
    const souceTypeQuery = sourceQuery ? `{ contractSKU: ${sourceQuery}}` : '';

    const query = `
    query {
      contractSKUCost(
        take: ${take}
        skip: ${skip}
        where: {
          and: [
            { skuCostContract: { merchant: { name: { contains: "${merchantName}" } } } }
            ${souceTypeQuery}
        ]
      }) {
        totalCount
        pageInfo {
          hasNextPage
        }
        items {
            skuId
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getInventoryListBySearchConditions(conditions: getInventoryListRequestInterface, filterBySourceSkuIds: number[], take: number, skip: number): Observable<BaseResponse> {
    const stockLevelQuery: string = conditions.isCritical ? 'stockLevel: CRITICAL' : '';
    const batchNoQuery: string = conditions.batchNo ? `batchProcessorBatchId: ${conditions.batchNo}` : '';
    const skuIdsQuery = filterBySourceSkuIds.length > 0 ? `where: { skuId: { in: [${filterBySourceSkuIds}]} }` : ''; // from getSkuIdsBySource()
    const startExpiryDate: string = conditions.startExpiryDate ? `startExpiryDate: "${conditions.startExpiryDate}"` : '';
    const endExpiryDate: string = conditions.endExpiryDate ? `endExpiryDate: "${conditions.endExpiryDate}"` : '';
    const startTrustAccountEndDate: string = conditions.startTrustAccountEndDate ? `startTrustAccountEndDate: "${conditions.startTrustAccountEndDate}"` : '';
    const endTrustAccountEndDate: string = conditions.endTrustAccountEndDate ? `endTrustAccountEndDate: "${conditions.endTrustAccountEndDate}"` : '';
    const startCreatedDate: string = conditions.startCreatedDate ? `startCreatedDate: "${conditions.startCreatedDate}"` : '';
    const endCreatedDate: string = conditions.endCreatedDate ? `endCreatedDate: "${conditions.endCreatedDate}"` : '';
    const takeQuery = take == 0 ? '' : `take: ${take}`
    const query = `
    query {
      inventoryDashboard(
        ${stockLevelQuery}
        ${batchNoQuery}
        ${skuIdsQuery}
        ${startExpiryDate}
        ${endExpiryDate}
        ${startTrustAccountEndDate}
        ${endTrustAccountEndDate}
        ${startCreatedDate}
        ${endCreatedDate}
        skip: ${skip}
        ${takeQuery}
      ) {
        totalCount
        pageInfo {
          hasNextPage
        }
        items {
          skuId
          warningWaterLevel
          distinctExpiryDate
          distinctTrustAccountDate
          totalRemainingQuantity
          stockLevel
          merchantSKU {
            skuNumber
            skuName
            voucherNumberRule {
              onDemand
              voucherGenerateWay
            }
          }
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getInventoryDetailsBySkuId(skuId: number): Observable<BaseResponse> {
    const skuIdQuery = `where: { skuId: { in: [${skuId}]} }`
    const query = `
    query {
      inventoryDashboard(
        ${skuIdQuery}
      ) {
        items {
          skuId
          warningWaterLevel
          totalRemainingQuantity
          stockLevel
          merchantSKU {
            skuNumber
            skuName
            voucherNumberRule {
              onDemand
              voucherGenerateWay
            }
          }
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }

  getWatermarks(skuId: number): Observable<BaseResponse> {
    const skuIdQuery = `where: { skuId: { in: [${skuId}]} }`
    const query = `
    query {
      inventorySKUBatches(
        ${skuIdQuery}
      ) {
          items {
              skuId
              warningWaterLevel
              apiOrderBuffer
              procurementQuantity
              replenishQuantity
          }
      }
  }`;
    return this.graphqlApiService.postQuery(query);
  }

  editWatermark(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/VoucherInventory/Sku`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  exportSkuInventoy(idsQuery: string): Observable<any> {
    const url = `${this._getURL()}api/VoucherDownload/Dashboard?${idsQuery}`;
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }

  downloadVoucherDetailsImport(skuIdBatchIdQuery: string): Observable<any> {
    const url = `${this._getURL()}api/VoucherDownload/Import/Batches/Vouchers?${skuIdBatchIdQuery}`;
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }

  downloadDetailsImportBatch(skuIdBatchIdQuery: string): Observable<any> {
    const url = `${this._getURL()}api/VoucherDownload/Import/Batch/Vouchers?${skuIdBatchIdQuery}`;
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }

  downloadVoucherDetailsTPC(skuIdBatchIdQuery: string): Observable<any> {
    const url = `${this._getURL()}api/VoucherDownload/TPC/Batches/Vouchers?${skuIdBatchIdQuery}`;
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }

  downloadVoucherDetailsEdenred(skuIdBatchIdQuery: string): Observable<any> {
    const url = `${this._getURL()}api/VoucherDownload/Edenred/Batches/Vouchers?${skuIdBatchIdQuery}`;
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }

  updateReservationQty(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/VoucherInventory/Reserve`;
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  getBatchIdByReservationCode(reservationCode: string): Observable<BaseResponse> {
    const query = `
    query {
        inventoryBatches(where: { reservationCode: { eq: "${reservationCode}" } }) {
            totalCount
            items {
                reservationCode
                id
            }
        } 
  }`;
    return this.graphqlApiService.postQuery(query);
  }

  deleteInventoryVoucherByBatchId(skuId: string, batchId: string, reason: string) {
    const body = {
      skuId: +skuId,
      batchId: +batchId,
      reason: reason,
    };
    const url = `${this._getURL()}api/VoucherInventory/DeleteVoucherByBatchId`;
    return this.http.delete(url, { body: body });
  }

  trashInventoryVoucherByBatchId(batchId: string, reason: string): Observable<BaseResponse> {
    const body = {
      batchId: +batchId,
      reason: reason,
    };
    const url = `${this._getURL()}api/VoucherInventory/TrashInventoryVoucher`;
    return this.http.post(url, body) as Observable<BaseResponse>;
  }

  updateBatchDate(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}/api/VoucherInventory/Batch`;
    return this.http.put(url, body) as Observable<BaseResponse>;
  }

  getBatchInventoryDetails(skuId: number, body: any, source: SkuDetailSourceTypeEnum): Observable<BaseResponse> {
    let batchQuery = ''
    if (source === this.skuDetailSourceTypeEnum.EDENRED) {
      batchQuery = `{ reservationCode: { eq: "${body.reservationCode}" }}`;
    };
    if (source === this.skuDetailSourceTypeEnum.IMPORT) {
      batchQuery =
      `{issueAvailableStartDate: { eq:  ${body.issueAvailableStartDate? `"${body.issueAvailableStartDate}"`: null} }}
        {issueAvailableEndDate: { eq: ${body.issueAvailableEndDate? `"${body.issueAvailableEndDate}"`: null} }}
        {expiryDate: { eq: ${body.expiryDate? `"${body.expiryDate}"`: null} }}`;
      if(body.trustAccountEndDate) {
        batchQuery = `
          ${batchQuery}
          {trustAccountEndDate: { eq: ${body.trustAccountEndDate? `"${body.trustAccountEndDate}"`: null} }}
        `
      }
    }
    const query = `
    query {
      inventoryBatches(where: { 
        and: [
            ${batchQuery}
            { skuId: { eq: ${skuId} }}
        ]
     }
     order: { id: DESC}) {
        totalCount
        items {
            id
            skuId
            quantity
            remainingQuantity
            lockedQuantity
            issueAvailableStartDate
            issueAvailableEndDate
            expiryDate
            trustAccountEndDate
            reservationCode
            createdOn
            createdBy
            batchProcessorBatchId
        }
      }
    }`;
    return this.graphqlApiService.postQuery(query);
  }
}
