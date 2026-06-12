import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetShopResponse } from '../models/get-merchant-shop-response.model';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { BaseResponse } from '../models/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class AcceptanceLoopService {

  constructor(private http: HttpClient,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) {}

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  private _getHeaders(): HttpHeaders {
    return this._authorizationLibraryService.getAMMHeaders();
  }

  public getAcceptanceLoopByMerchantId(merchantId: number, take:number = 10 , skip:number = 0): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
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
    return this.http.post(url, body) as Observable<BaseResponse>;
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

  public getAcceptanceLoopById(acceptanceLoopId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = { query: 
      `query {
        acceptanceLoops(where:{acceptanceLoopId: {eq: ${acceptanceLoopId}}}) {
          items {
            acceptanceLoopId
            code
            description
            status
            acceptanceLoopMerchant {
              merchantId
            }
          }
        }
      }`
    };
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.post(url, body,{ headers }) as Observable<BaseResponse>;
  }

  public getAcceptanceLoopByMultId(acceptanceLoopId: number[]): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const body = { query: 
      `query {
        acceptanceLoops(where:{acceptanceLoopId: {in:[${acceptanceLoopId.toString()}] }}) {
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

  public getAcceptanceLoopMerchantShopsByMerchantId(merchantId: number ,take:number = 10 , skip:number = 0): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
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

  public getMerchantShop(merchantId: number): Observable<GetShopResponse> {
      if (merchantId === 0) {
          return of({
              data: {
                  shopDetailsModel: [],
                  totalCount: 0
              },
              message: 'Success',
              success: true
          });
      }
      const url = `${this._getURL()}api/MerchantShop?SearchKeyword=${''}${'&MerchantId='}${merchantId}&RowCount=${2147483647}&PageNumber=${1}`;
      return this.http.get(url, { headers: this._getHeaders() }) as Observable<GetShopResponse>;
  }

  public getAcceptanceLoopShops(acceptanceLoopMerchantId: number): Observable<any> {
      const body = JSON.stringify( 
          { query: 
              `query{
                  acceptanceLoopMerchants(where:{acceptanceLoopMerchantId: {eq: ${acceptanceLoopMerchantId}}}) {
                      items {
                          acceptanceLoopMerchantShops() {
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
          })
          
      const url = `${this._getURL()}api/GraphQL/Query`;
      return this.http.post(url, body, { headers: this._getHeaders() }) as Observable<BaseResponse>;
  }

  public getAcceptanceLoopsAggregationByMerchantGroupId(merchantGroupId: number, 
    skip?: number, take?: number, acceptanceLoopId: number = 0): Observable<BaseResponse> {

  const url = `${this._getURL()}api/GraphQL/Query`;
  const skipClause = skip ? `, skip: ${skip}` : '';
  const takeClause = take ? `, take: ${take}` : '';
  const acceptanceLoopIdClause = acceptanceLoopId === 0 ?
    "":
   `,{ acceptanceLoopId: { eq: ${acceptanceLoopId} } }`

  const body = { query: 
    `query {
      acceptanceLoopsAggregation( 
        where: {
          and: [
            { merchantGroupId: { eq: ${merchantGroupId} } } ${acceptanceLoopIdClause}
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
  const headers = new HttpHeaders().append('loading-indicator', 'none');
  return this.http.post(url, body,{ headers }) as Observable<BaseResponse>;
}

public getMonoAcceptanceLoopByMerchantIdAndAcceptanceLoopId(merchantId: number , acceptanceLoopId: number, take:number = 10 , skip:number = 0): Observable<BaseResponse> {
  const url = `${this._getURL()}api/GraphQL/Query`;
  const skipClause = skip ? `, skip: ${skip}` : '';
  const takeClause = take ? `, take: ${take}` : '';
  const body = { query: 
    `query{ monoAcceptanceLoopByMerchantId(merchantId: ${merchantId} 
      where: { acceptanceLoopId : {eq : ${ acceptanceLoopId } }}
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

}
