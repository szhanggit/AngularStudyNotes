import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AcceptanceLoopCreateRequest, AcceptanceLoopEditRequest, PageDetails } from '../models/acceptance-loop.model';
import { BaseResponse } from './base-response.model';
import { TenantConfigService } from './tenant-config.service';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';

@Injectable({
  providedIn: 'root'
})
export class AcceptanceLoopApiService {

  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) {}

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  private _getHeaders(): HttpHeaders {
    return this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant());
  }

  public getAcceptanceLoopByMerchantId(merchantId: number, take:number = 10 , skip:number = 0): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const tenantId = this._tenantConfigService.getTenant().id.toString();
    const body = { query:
      `query{
        acceptanceLoops(where: {acceptanceLoopMerchant : {some:{merchantId:{eq: ${merchantId} }}} } take:${take} skip:${skip}
          order: [{isDefault: DESC}])
        {
          totalCount
          items{
            acceptanceLoopId,
            code,
            description,
            status,
            createdBy,
            createdOn,
            isDefault,
            acceptanceLoopMerchants  {
              acceptanceLoopMerchantId
              acceptanceLoopId
              merchantId
              merchant() {
                  merchantId
                  name
                  description
              }
              acceptanceLoopMerchantShops() {
                  status
                  shopId
                  shop() {
                      name
                      status
                      identityCode
                  }
              }
            }
          }
        }
      }`
    };
    return this.http.post(url, body,{ headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getAcceptanceLoopById(acceptanceLoopId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const tenantId = this._tenantConfigService.getTenant().id.toString();
    const body = { query:
      `query {
        acceptanceLoops(where:{acceptanceLoopId: {eq: ${acceptanceLoopId}}}) {
          items {
            acceptanceLoopId
            code
            description
            status
            createdOn
            lastUpdatedOn
          }
        }
      }`
    };
    return this.http.post(url, body,{ headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getAcceptanceLoopByMultId(acceptanceLoopId: number[], take:number = 100 , skip:number = 0): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const tenantId = this._tenantConfigService.getTenant().id.toString();
    const body = { query:
      `query {
        acceptanceLoops(where:{acceptanceLoopId: {in:[${acceptanceLoopId.toString()}] }} take:${take} skip:${skip}) {
          items {
            acceptanceLoopId
            code
            description
            status
            createdBy
            createdOn
            isDefault
          }
        }
      }`
    };
    return this.http.post(url, body,{ headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  // TODO: not in use?
  public getAcceptanceLoopMerchantShopsByMerchantId(merchantId: number ,take:number = 10 , skip:number = 0): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const tenantId = this._tenantConfigService.getTenant().id.toString();
    const body = { query:
      `query {
        acceptanceLoopMerchants(where:{merchantId: {eq: ${merchantId}}}  take:${take} skip:${skip}) {
          totalCount
          items {
            acceptanceLoopMerchantId
            acceptanceLoopId
            merchantId
            merchant() {
                merchantId
                name
                description
            }
            acceptanceLoopMerchantShops() {
                status
                shopId
                shop() {
                    name
                    status
                    identityCode
                }
            }
          }
        }
      }`
    }
    return this.http.post(url, body,{ headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getAcceptanceLoopMerchantShopsById(acceptanceLoopMerchantId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = { query:
      `query {
        acceptanceLoopMerchants(where:{acceptanceLoopMerchantId: {eq: ${acceptanceLoopMerchantId}}}) {
          items {
            acceptanceLoopMerchantId
            acceptanceLoopId
            merchantId
            status
            acceptanceLoopMerchantShops() {
              acceptanceLoopMerchantShopId
              status
              shop() {
                shopId
                name
                status
                identityCode
              }
            }
          }
        }
      }`
    }
    return this.http.post(url, body,{ headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getMerchantShop(merchantId: number, skip?: number, take?: number): Observable<BaseResponse> {
      const url = `${this._getURL()}api/GraphQL/Query`;
      const skipClause = skip ? `, skip: ${skip}` : '';
    const takeClause = take ? `, take: ${take}` : '';
    const body = { query:
      `query {
        shops(where : { merchantId : {eq : ${merchantId} }}
          ${skipClause}
          ${takeClause}
        order: [{createdOn: DESC}])
        {
            totalCount
            items
            {
                shopId,
                name,
                status,
                identityCode,
                createdOn
            }
        }
    }`
    }
    return this.http.post(url, body,{ headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getMerchantShops(merchantId: number, searchKey: string, pageDetails: PageDetails): Observable<BaseResponse> {
    const body = { query:
      `query{
        shops(
          where: { and: [
            { merchantId : { eq : ${merchantId} } },
            { status: {eq: 1 } },
            { or: [ { name: { contains: "${searchKey}" } }, { identityCode: { contains: "${searchKey}" } } ]  }
          ] }
          order: { createdOn: DESC }
          skip : ${(pageDetails.currentPage - 1) * pageDetails.pageSize}
          take : ${pageDetails.pageSize}
        ){
          totalCount
          items
          {
            shopId,
            name,
            status,
            identityCode
          }
        }
      }`
    }
    const url = `${this._getURL()}api/GraphQL/Query`;
    return this.http.post(url, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getAcceptanceLoopMerchantShops(acceptanceLoopMerchantId: number, searchKey: string, pageDetails: PageDetails): Observable<BaseResponse> {
      const body = { query:
        `query{
          acceptanceLoopMerchantShops(
            where: { and: [
              { acceptanceLoopMerchantId: { eq: ${acceptanceLoopMerchantId} } },
              { status: { eq: true } }
              { merchantShop: { and: [
                { status: { eq: 1 } }
                { or: [ { name: { contains: "${searchKey}" } }, { identityCode: { contains: "${searchKey}" } } ] }
              ] } }
            ] }
            order: { createdOn: DESC }
            skip : ${(pageDetails.currentPage - 1) * pageDetails.pageSize}
            take : ${pageDetails.pageSize}
          ){
            totalCount
            items{
              acceptanceLoopMerchantShopId
              status
              merchantShop {
                shopId
                name
                identityCode
                status
              }
            }
          }
        }`
      }
      const url = `${this._getURL()}api/GraphQL/Query`;
      return this.http.post(url, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public updateAcceptanceLoop(req: AcceptanceLoopEditRequest): Observable<BaseResponse> {
    const url = `${this._getURL()}api/AccLoop/AcceptanceLoop`;
    return this.http.put(url, req , { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public createAcceptanceLoop(req: AcceptanceLoopCreateRequest): Observable<BaseResponse> {
    const url = `${this._getURL()}api/AccLoop/AcceptanceLoop`;
    return this.http.post(url, req , { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getAcceptanceLoopsAggregationByMerchantGroupId(merchantGroupId: number,
      skip?: number, take?: number,
      acceptanceLoopId: number = 0, isActiveMerchantOnly = true): Observable<BaseResponse> {

    const url = `${this._getURL()}api/GraphQL/Query`;
    const skipClause = skip ? `, skip: ${skip}` : '';
    const takeClause = take ? `, take: ${take}` : '';
    const acceptanceLoopIdClause = acceptanceLoopId === 0 ?
      "":
     `{ acceptanceLoopId: { eq: ${acceptanceLoopId} } }`

    const body = { query:
      `query {
        acceptanceLoopsAggregation(
          isActiveMerchantOnly: ${isActiveMerchantOnly}
          where: {
            and: [
              { merchantGroupId: { eq: ${merchantGroupId} } }
              ${acceptanceLoopIdClause}
            ]
          }
          order: { createdOn: DESC }
          ${skipClause}
          ${takeClause}
        ) {
          totalCount
          items {
            acceptanceLoopId
            code
            description
            status
            createdBy
            createdOn
            lastUpdatedOn
            isDefault
            products
            {
              totalCount
            }
            merchantAggregation
            {
              acceptanceLoopMerchantId
              merchantId
              merchantName
              selectedShopCount
              availableShopCount
              selectedShopCount
              merchantShopCount
              status
              merchantActiveShopCount
              merchantInactiveShopCount
            }
          }
        }
      }`
    }
    return this.http.post(url, body,{ headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getAcceptanceLoopProducts(acceptanceLoopId: number, searchKey: string, pageDetails: PageDetails): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = { query:
      `query{
        products(
          where: {
            acceptanceLoopId: { eq: ${acceptanceLoopId} }
            or: [ { productName: { contains: "${searchKey}" } }, { productCode: { contains: "${searchKey}" } } ]
          }
          skip : ${(pageDetails.currentPage - 1) * pageDetails.pageSize}
          take : ${pageDetails.pageSize}
        ){
            totalCount
            items {
                productId
                productName
                productCode
            }
        }
      }`
    }
    return this.http.post(url, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getMonoAcceptanceLoopByMerchantId(merchantId: number, skip?: number, take?: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const skipClause = skip ? `, skip: ${skip}` : '';
    const takeClause = take ? `, take: ${take}` : '';
    const body = { query:
      `query{
        monoAcceptanceLoopByMerchantId(merchantId: ${merchantId}
          order: [{isDefault: DESC}, { createdOn: DESC }]
          ${skipClause}
          ${takeClause}
          )
          {
            totalCount
              items {
                acceptanceLoopId
                code
                description
                isDefault
                shopCountAvailableInAL
                status
                createdBy
                createdOn
              }
          }
        }`
    }
    return this.http.post(url, body,{ headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getMonoAcceptanceLoopMerchantShopByAcceptanceLoopId(acceptanceLoopId: number, skip?: number, take?: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const skipClause = skip ? `, skip: ${skip}` : '';
    const takeClause = take ? `, take: ${take}` : '';
    const body = { query:
      `query{
        acceptanceLoopMerchants(where: { acceptanceLoopId : {eq : ${ acceptanceLoopId } } }
          ${skipClause}
          ${takeClause}
        )
        {
          totalCount
          items{
            acceptanceLoopId
            acceptanceLoopMerchantId
            acceptanceLoopMerchantShops {
              acceptanceLoopMerchantShopId
			        shopId
              status
			      }
          }
        }
      }`
    }
    return this.http.post(url, body,{ headers: this._getHeaders() }) as Observable<BaseResponse>;
  }
}
