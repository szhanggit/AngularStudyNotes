import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContractBatchSku, ContractCreateRequest, ContractDraftEditRequest, ContractUpdateRequest } from '../models/contract-create-request';
import { UpdateContractPeriod } from '../models/update-contract-period';
import { UpdateContractRequest } from '../models/update-contract-period';
import { BaseResponse } from './base-response.model';
import { TenantConfigService } from './tenant-config.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private _state: ContractCreateRequest = {
    contractName : "",
    startDate : "",
    endDate : "",
    merchantId : 0,
    paymentTermId : 0,
    priceOptionId : 0,
    costSchemeId : 0,
    costPercentage : 0,
    costRoundingRuleId : 0,
    costRoundingPlacesId : 0,
    listSku : [],
  }


  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) { }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  _setContract(patch: Partial<ContractCreateRequest>) {
    Object.assign(this._state, patch);
  }

  _getContract() : ContractCreateRequest {
    return this._state;
  }

  public getCount(merchantId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const tenantId = this._tenantConfigService.getTenant().id.toString();
    const body = { query: 
      `query { 
        contracts( merchantId: ${merchantId} ) 
        { 
            totalCount 
        } 
      }`
    };
    return this.http.post(url, body,{ headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  // will call on graphql query merchants to get contract list: MerchantInfo
  getAll(pageIndex : number = 0, pageSize : number = 20, searchTerm : string = "", contractStatus : number, valid : boolean = true,  merchantId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
        contracts(
          keyword : \"${searchTerm}\" 
          valid : ${valid} 
          contractStatus : ${contractStatus} 
          skip: ${pageIndex} 
          take: ${pageSize} 
          merchantId: ${merchantId}
          order :{createdTime: DESC}
        ) {
            totalCount

          items {
            contractId
      
            contractName
      
            startDate
      
            endDate

            contractNumber

            displayStatus
      
            contractPaymentTerm {
              id
      
              value
            }
      
            contractPriceOption {
              id
      
              value
            }
      
            contractCostScheme {
              id
      
              value
            }
      
            costPercentage
      
            contractCostRoundingRule {
              id
      
              value
            }

            contractCostRoundingPlaces{
              id

              value
            }
      
            skuQuantity
      
            statusId
          }
        }
      }`};
    this._setContract({
      contractName : "",
    startDate : "",
    endDate : "",
    merchantId : 0,
    paymentTermId : 0,
    priceOptionId : 0,
    costSchemeId : 0,
    costPercentage : 0,
    costRoundingRuleId : 0,
    costRoundingPlacesId : 0,
    listSku : [],
    });
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  // will call on graphql query merchants to get contract by merchantId and contractId: MerchantInfo
  getByID(merchantId: number, contractId : number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
        contracts(
          merchantId: ${merchantId}
          where : { contractId : {eq : ${contractId} } }
        ) {
          items {
            contractId
      
            contractName
      
            startDate
      
            endDate

            contractNumber

            displayStatus

            skuQuantity
      
            statusId

            creator

            createdTime
      
            contractPaymentTerm {
              id
      
              value
            }
      
            contractPriceOption {
              id
      
              value
            }
      
            contractCostScheme {
              id
      
              value
            }
      
            costPercentage
      
            contractCostRoundingRule {
              id
      
              value
            }

            contractCostRoundingPlaces{
              id

              value
            }
          }
        }
      }`};
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  create(data : ContractCreateRequest){
    const url = `${this._getURL()}api/Contract/CreateContract`;
    return this.http.post(url, data, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  editContractDraft(data : ContractDraftEditRequest){
    const url = `${this._getURL()}api/Contract/UpdateContract`;
    return this.http.put(url, data, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

 

  getContractStatusCSS(status : string) : string{
    if(status.toLowerCase() == "draft" || status.toLowerCase() == "expired"){
      return "badge bg-light text-dark p-1 lbl-bg-expired";
    }
    else if(status.toLowerCase() == "valid"){
      return "badge badge-success-lighten text-dark p-1 lbl-bg-valid";
    }
    return "badge bg-primary p-1";
  }
  /// <summary>
  /// Download for sample import SKU batch file.
  /// </summary>
  downloadSkuTemplate(merchantId:number){   
    const url = `${this._getURL()}api/Contract/DownloadSkuTemplate?MerchantId=${merchantId}`;
    return this.http.get(url,{ headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()),responseType: 'blob', observe: 'response' });
  }
  /// <summary>
  /// SKU batch file for validate the details.
  /// </summary>
  uploadSku(data : FormData) : Observable<BaseResponse>{    
    const url = `${this._getURL()}api/Contract/UploadSku`;
    const headers : HttpHeaders = this._authorizationLibraryService.getAMMHeaders(
      this._tenantConfigService.getTenant()).delete('content-type', 'application/json');   
    return this.http.post(url, data, {headers}) as Observable<BaseResponse>;
  }
  updateContractPeriod(data : UpdateContractPeriod){
    const url = `${this._getURL()}api/Contract/ContractPeriod`;
    return this.http.put(url, data, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  editContract(data : ContractUpdateRequest){
    const url = `${this._getURL()}api/Contract/UpdateContract`;
    return this.http.put(url, data, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
  /// <summary>
  /// Service to update future contract period
  /// </summary>
  updateFutureContractPeriod(data : UpdateContractRequest){
    const url = `${this._getURL()}api/Contract/UpdateContract`;
    return this.http.put(url, data, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
  /// <summary>
  /// Service to ongoing ,draft and future contract added bulk sku
  /// </summary>
  createBulkSku(data : ContractBatchSku){
    const url = `${this._getURL()}api/Contract/BatchSku`;
    return this.http.post(url, data, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
}
