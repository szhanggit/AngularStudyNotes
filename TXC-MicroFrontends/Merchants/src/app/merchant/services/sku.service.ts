import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from './base-response.model';
import { TenantConfigService } from './tenant-config.service';
import { SkuCreateRequest, SkuUpdateRequest } from '../models/contract-create-request';
@Injectable({
  providedIn: 'root'
})
export class SkuService {

  taxRateValue : any = "";

  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  getAll(pageIndex : number = 0, pageSize : number = 20, searchTerm : string = "",  valid : boolean | undefined,  merchantId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const validClause = valid !== undefined ? `, valid: ${valid}` : '';
    const data = { query: `query {
      contractSkuByMerchantId
          (
          keyword : \"${searchTerm}\" 
          ${ validClause } 
          skip: ${pageIndex} 
          take: ${pageSize} 
          merchantId: ${merchantId}  
          order :{createdDateTime: DESC}  
           )
               { 
                 totalCount
                         items 
                            {
                              id
                              skuName  
                              skuNumber
                              merchantGroupId
                              faceValueWithTax
                              multiplier
                              skuType    
                                  {       
                                        id    
                                        value 
                                  }      
                              contractSKUCosts   
                                  {            
                                        costWithTax
                                        validStartDate
                                        validEndDate
                                        contractSkuStatus
                                           {
                                              id
                                              value  
                                            }
                                            skuCostContract
                                            {
                                                contractId
                                                contractName
                                                contractNumber
                                                contractCostScheme{
                                                  id
                                                }
                                            }        
                                   }
                               voucherNumberRule       
                                   {              
                                        ruleName
                                        voucherNumberRuleId
                                   } 
                                    createdBy
                                    createdDateTime
                     }
              }

      }`
    };
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  getAllByContractId(pageIndex : number = 0, pageSize : number = 20, searchTerm : string = "", contractId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
      contractSKUByContractId
          (
          keyword : \"${searchTerm}\"
          contractId :  ${contractId}
          skip: ${pageIndex} 
          take: ${pageSize} 
          order :{createdDateTime: DESC}  
           )
              {
                totalCount
                items 
                  {
                    id
                    skuName  
                    skuNumber
                    merchantGroupId
                    faceValueWithTax
                    multiplier
                    skuType    
                        {       
                              id    
                              value 
                        }      
                    contractSKUCosts   
                        {         
                              id   
                              costWithTax
                              validStartDate
                              validEndDate
                              contractSkuStatus
                                  {
                                    id
                                    value  
                                  }
                                  skuCostContract
                                  {
                                      contractId
                                      contractName
                                      contractNumber
                                      contractCostScheme{
                                        id
                                      }

                                  }        
                          }
                      voucherNumberRule       
                          {              
                            voucherNumberRuleId  
                            ruleName
                          } 
                          createdBy
                          createdDateTime
                  }
              }

      }`
    };
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  getSkuById(skuId:number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
      skuById(skuId:${skuId}) {
        createdBy, typeId,
        faceValueWithoutTax, 
        faceValueWithTax, 
        multiplier, 
        skuName 
        skuNumber
        contractSKUCosts{
          id
          costWithTax
          validStartDate
          validEndDate
          contractId          
          skuCostContract
          {
              contractName
              contractNumber
              contractId
              costSchemeId
              startDate
              contractCostScheme {
                id,
                value
            }
          }
          contractSkuStatus{
            id
            value
        }
      } 
        voucherNumberRule 
        {
          ruleName
          voucherNumberRuleId
        }
    }
  ,
  productsBySkuIds(skuIds:${skuId})
  {
   productId
   productName
  }
}`
};
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
  public updatesku(data: SkuUpdateRequest) {
    const url = `${this._getURL()}api/Contract/Sku`;
    return this.http.put(url, data , { headers:  this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
 
  public createSKU(data: SkuCreateRequest) {
    const url = `${this._getURL()}api/Contract/Sku`;
    return this.http.post(url, data , { headers:  this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  getExpiredCostBySkuId(skuId: number) {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
          contractSKUCost(
              where: {skuId: {eq: ${skuId}}}
              order: {validEndDate: DESC}){
              totalCount
              items{
                contractId
                  skuId
                  costWithTax,
                  validStartDate,
                  validEndDate,
                  contractSkuStatus{
                      id,
                      value
                  },
                  skuCostContract{
                      contractName,
                      contractNumber,
                      contractCostScheme {
                        id,
                        value
                    }
                  }
              }
          }
      }`
    };
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }


  //Get SKU List By Contract ID
  getSKUCountByMerchantID(merchantId: number) {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: ` query
    {
       contracts (merchantId:${merchantId})
       {
           items
           {
               contractId,
               contractName,
               contractSKUCosts
               {
                   skuId
               }
           }
       }
    }`
    };
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
  getMerchantByMerchantGroupId(merchantGroupId:number): Observable<BaseResponse> 
  {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query{
          merchants(where :{ merchantGroupId :{eq:${merchantGroupId}} })
          {
              items
              {
                  merchantGroupId
                  merchantId
              }
          }
      }`
    };
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  //Get Product Detail by the SKU ID
  getSkuProductById(skuId:number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
    productsBySkuIds(skuIds:${skuId})
      {
      productId
      productName
      }
    
  }`
  };
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  getCompanyTaxRate() {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
      taxRateByTenantId {
        companyTaxRate
      }
    }`
    }
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  updateCompanyTaxRate(){
    this.getCompanyTaxRate().subscribe((resp) => {
      let response = JSON.parse(resp.data);
      let taxRate =  response.taxRateByTenantId.companyTaxRate;
      this.taxRateValue = taxRate; 
  })
  }

  getCostWithoutTax(costWithTax: number){
    let taxRate = this.taxRateValue;

    let costwithouttax :any ;
    if(costWithTax.toString().trim() !== "" && Number(costWithTax.toString().trim()) !== 0 && !isNaN(costWithTax)){
      costwithouttax = (costWithTax / taxRate).toFixed(4);
    }
    else if(costWithTax.toString().trim() !== "" && Number(costWithTax.toString().trim()) === 0){
      costwithouttax = "0";
    }
    else if(costWithTax.toString().trim() === "" || isNaN(costWithTax)){
      costwithouttax = "";
    }
    return costwithouttax;
  }
 

}
